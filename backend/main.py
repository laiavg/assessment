from typing import Annotated

from celery.result import AsyncResult
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form

from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from models import Parameters
from utils import save_pdf
from worker import create_task

load_dotenv()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# TODO: Add Validation: Got a larger chunk overlap (54) than chunk size (34), should be smaller.

@app.post("/upload")
def run_splitter(
        file: Annotated[UploadFile, File()],
        chunk_size: int = Form(default=100),
        chunk_overlap: int = Form(default=20),
        is_separator_regex: bool = Form(default=False)
):

    file_path = save_pdf(file)

    parameters = Parameters(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        is_separator_regex=is_separator_regex
    )

    task = create_task.delay(
        file_path,
        parameters.model_dump_json()
    )

    return JSONResponse({"task_id": task.id})


@app.get("/tasks/{task_id}")
def get_status(task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JSONResponse(result)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
