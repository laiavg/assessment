from fastapi import UploadFile
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session

from backend.db.models import Document, Chunk
from backend.models import Parameters
from backend.utils import save_pdf


def split_text(db: Session, file: UploadFile, parameters: Parameters):

    path = save_pdf(file)
    loader = PyPDFLoader(path)

    text_splitter = RecursiveCharacterTextSplitter(
        length_function=len,
        **vars(parameters)
    )

    pages = loader.load_and_split(text_splitter)
    document = Document(filename=file.filename)

    for chunk in pages:
        db.add(Chunk(text=chunk.page_content, document=document))

    db.add(document)
    db.commit()

    return document
