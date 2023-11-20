from langchain.text_splitter import RecursiveCharacterTextSplitter

with open('dummy_document.txt') as f:
    document = f.read()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=20,
    length_function=len,
    is_separator_regex=False,
)

texts = text_splitter.create_documents([document])

print(texts[0])
print(texts[1])
