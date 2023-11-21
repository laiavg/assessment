import os

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session

from src.db.models import Document, Chunk


def split_text(db: Session):

    current_directory = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_directory, 'dummy.pdf')
    loader = PyPDFLoader(filename)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )

    pages = loader.load_and_split(text_splitter)
    document = Document(filename=filename)

    for chunk in pages:
        db.add(Chunk(text=chunk.page_content, document=document))

    db.add(document)
    db.commit()
