from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    filename = Column(Text)
    chunks = relationship('Chunk', back_populates='document')


class Chunk(Base):
    __tablename__ = 'chunks'
    id = Column(Integer, primary_key=True)
    text = Column(Text)
    document_id = Column(Integer, ForeignKey('documents.id'))
    document = relationship('Document', back_populates='chunks')
