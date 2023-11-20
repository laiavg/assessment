from sqlalchemy import create_engine, Column, Integer, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

engine = create_engine('sqlite:///database.db', echo=True)

Base = declarative_base()


class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    chunks = relationship('Chunk', back_populates='document')


class Chunk(Base):
    __tablename__ = 'chunks'
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey('documents.id'))
    document = relationship('Document', back_populates='chunks')


Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()