import axios from "axios";
import {Task} from "./types.ts";

export const api = axios.create({
    baseURL: 'http://localhost:8000', // TODO: read from env variable
})

export const apiClient = {
    upload: async (file: File, chunkSize?: string, chunkOverlap?: string, isSeparatorRegex?: string) => {
        const formData = new FormData();
        formData.append('file', file);

        if (chunkSize) formData.append('chunk_size', chunkSize);
        if (chunkOverlap) formData.append('chunk_overlap', chunkOverlap);
        if (isSeparatorRegex) formData.append('is_separator_regex', isSeparatorRegex);

        const response = await api.post<{ task_id: string }>('/upload', formData)
        return response.data
    },

    getTask: async (task_id: string)=> {
        const response = await api.get<Task>(`/tasks/${task_id}/`)
        return response.data
    }
}