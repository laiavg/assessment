import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, UploadFile, File, Form, Body

from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from db.models import Base
from models import Parameters, get_document_info
from core.splitter import split_text
from worker import create_task

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


# TODO: Add Validation: Got a larger chunk overlap (54) than chunk size (34), should be smaller.

@app.post("/upload")
def run_splitter(
        file: Annotated[UploadFile, File()],
        chunk_size: int = Form(default=100),
        chunk_overlap: int = Form(default=20),
        is_separator_regex: bool = Form(default=False),
        db: Session = Depends(get_db),
):
    parameters = Parameters(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        is_separator_regex=is_separator_regex
    )

    document = split_text(db, file, parameters)

    return get_document_info(document)


@app.post("/tasks", status_code=201)
def run_task(payload = Body(...)):
    task_type = payload["type"]
    task = create_task.delay(int(task_type))
    return JSONResponse({"task_id": task.id})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
