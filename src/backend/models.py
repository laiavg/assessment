from typing import List

from pydantic import BaseModel


class Parameters(BaseModel):
    chunk_size: int
    chunk_overlap: int
    is_separator_regex: bool


class ChunkInfo(BaseModel):
    id: int
    text: str


class DocumentInfo(BaseModel):
    id: int
    chunks_count: int
    chunks: List[ChunkInfo]


def get_document_info(document) -> DocumentInfo:
    chunks_info = []
    for chunk in document.chunks:
        chunk_info = ChunkInfo(id=chunk.id, text=chunk.text)
        chunks_info.append(chunk_info)

    document_info = DocumentInfo(
        id=document.id,
        chunks_count=len(document.chunks),
        chunks=chunks_info,
    )

    return document_info
