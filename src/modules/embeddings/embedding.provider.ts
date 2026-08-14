export interface EmbeddingProvider {
  generateEmbeddings(
    contents: string[],
  ): Promise<number[][]>;

  generateEmbedding(
    content: string,
  ): Promise<number[]>;
}