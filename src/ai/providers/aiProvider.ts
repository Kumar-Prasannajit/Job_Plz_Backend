export interface AIProvider {
  extractResume(
    rawResume: string,
    prompt: string
  ): Promise<Record<string, unknown>>;
}