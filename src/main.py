import os

from dotenv import load_dotenv
from fastapi import FastAPI
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from src.db.models import Base

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
