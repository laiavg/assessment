import os

from fastapi import UploadFile


def save_pdf(content: UploadFile) -> str:
    current_directory = os.getcwd()

    directory_path = os.path.join(current_directory, os.getenv("FILES_URL"))
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)

    file_path = os.path.join(directory_path, f"{content.filename}")
    with open(file_path, "wb") as file:
        file.write(content.file.read())

    return file_path
