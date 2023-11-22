export interface Chunk {
    id: number;
    text: string;
}

export interface Document {
    id: number;
    chunks_count: number;
    chunks: Chunk[]
}

export enum TaskStatus {
    PENDING = "PENDING",
    STARTED = "STARTED",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    REVOKED = "REVOKED",
}

export interface Task {
    task_id: string;
    task_status: TaskStatus
    task_result: Document
}
