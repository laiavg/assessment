import os

from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session

from src.db.models import Document, Chunk


def split_text(db: Session):

    current_directory = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_directory, 'dummy_document.txt')

    with open(filename) as f:
        text = f.read()

    document = Document(filename=filename)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )

    texts = text_splitter.create_documents([text])

    print(texts)

    for chunk in texts:
        db.add(Chunk(text=chunk.page_content, document=document))

    db.add(document)
    db.commit()
