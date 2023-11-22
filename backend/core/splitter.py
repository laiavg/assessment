import os

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from db import Document, Chunk
from models import Parameters


def split_text(file_path: str, parameters, session):

    loader = PyPDFLoader(file_path)

    parameters = Parameters.model_validate_json(parameters)
    text_splitter = RecursiveCharacterTextSplitter(
        length_function=len,
        **vars(parameters)
    )

    pages = loader.load_and_split(text_splitter)
    document = Document(filename=os.path.basename(file_path))

    for chunk in pages:
        session.add(Chunk(text=chunk.page_content, document=document))

    session.add(document)
    session.commit()

    return document
