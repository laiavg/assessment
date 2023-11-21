import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8000', // TODO: read from env variable
})

export const apiClient = {
    upload: async (file: File, chunkSize?: number, chunkOverlap?: number, isSeparatorRegex?: boolean) => {
        const formData = new FormData();
        formData.append('file', file);

        if (chunkSize) formData.append('chunk_size', chunkSize.toString());
        if (chunkOverlap) formData.append('chunk_overlap', chunkOverlap.toString());
        if (isSeparatorRegex) formData.append('is_separator_regex', isSeparatorRegex.toString());

        return await api.post('/upload', formData)
    }
}