from pydantic import BaseModel


class Parameters(BaseModel):
    chunk_size: int
    chunk_overlap: int
    is_separator_regex: bool
