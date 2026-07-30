import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

class ResumeParserService {
  async parse(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text.trim();
  }
}

export const resumeParserService = new ResumeParserService();