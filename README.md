# Project Overview

This project is a full-stack application that provides users an interface to split a PDF using the LangChain library.

## Tech Stack

- Frontend: React
- Backend: FastAPI
- Task Queue: Celery
- Message Broker: Redis

## Asynchronous Processing

When the backend receives a request, it uses Celery and Redis for asynchronous task execution.

## Running the Application

### Docker Compose

Use Docker Compose to run the entire application stack. Navigate to the project directory containing your `docker-compose.yml` file and run:

```bash
docker-compose up -d
