import os
from celery import Celery

from app.splitter import split_text
from app.db import db_session

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")


class SqlAlchemyTask(celery.Task):
    """An abstract Celery Task that ensures that the connection with the db is closed on task completion"""
    abstract = True

    def after_return(self, status, retval, task_id, args, kwargs, einfo): # noqa
        db_session.remove()


@celery.task(name="create_task", base=SqlAlchemyTask)
def create_task(file_path, parameters):
    with db_session() as session:
        document = split_text(file_path, parameters, session)
        return document.to_json()
