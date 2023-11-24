import os
from sqlalchemy import create_engine, Column, Integer, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, scoped_session

engine = create_engine(os.getenv("DATABASE_URL"))
Base = declarative_base()


class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    filename = Column(Text)
    chunks = relationship('Chunk', back_populates='document')

    def to_json(self):
        chunk_list = [{'id': chunk.id, 'text': chunk.text} for chunk in self.chunks]
        return {'id': self.id, 'chunk_count': len(self.chunks), 'chunks': chunk_list}


class Chunk(Base):
    __tablename__ = 'chunks'
    id = Column(Integer, primary_key=True)
    text = Column(Text)
    document_id = Column(Integer, ForeignKey('documents.id'))
    document = relationship('Document', back_populates='chunks')


Base.metadata.create_all(bind=engine)

session_factory = sessionmaker(bind=engine)
db_session = scoped_session(session_factory)
