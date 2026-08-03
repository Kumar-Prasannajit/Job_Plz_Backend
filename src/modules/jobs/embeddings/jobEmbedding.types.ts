export interface JobEmbeddingChunk {
  chunkIndex: number;

  chunkType:
    | "JOB_SUMMARY"
    | "REQUIREMENTS"
    | "SKILLS"
    | "RESPONSIBILITIES";

  content: string;
}

export interface EmbeddedJobChunk extends JobEmbeddingChunk {
  embedding: number[];
}