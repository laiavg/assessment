interface Chunk {
    id: number;
    text: string;
}

interface Document {
    id: number;
    chunks_count: number;
    chunks: Chunk[]
}