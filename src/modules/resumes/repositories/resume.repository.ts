import { and, desc, eq } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { resumes } from "../../../db/schema.js";
import type { Resume } from "../../../db/schema.js";
import type { CanonicalResume } from "../schemas/canonicalResume.schema.js";

export interface CreateResumeInput {
  userId: string;
  originalFileName: string;
  cloudinaryUrl: string;
  cloudinaryId: string;
  parsedData: CanonicalResume;
  parserVersion: string;
}

class ResumeRepository {
  async create(data: CreateResumeInput): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values({
        userId: data.userId,
        originalFileName: data.originalFileName,
        cloudinaryUrl: data.cloudinaryUrl,
        cloudinaryId: data.cloudinaryId,
        parsedData: data.parsedData,
        parserVersion: data.parserVersion,
      })
      .returning();

    if (!resume) {
      throw new Error("Failed to create resume.");
    }

    return resume;
  }

  async findByUserId(userId: string): Promise<Resume[]> {
    return db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.createdAt));
  }

  async findById(resumeId: string): Promise<Resume | null> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    return resume ?? null;
  }

  async findByIdAndUserId(
    resumeId: string,
    userId: string,
  ): Promise<Resume | null> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
      .limit(1);

    return resume ?? null;
  }

  async updateParsedData(
    resumeId: string,
    parsedData: CanonicalResume,
  ): Promise<Resume> {
    const [resume] = await db
      .update(resumes)
      .set({
        parsedData,
        parserVersion: parsedData.metadata.parserVersion,
      })
      .where(eq(resumes.id, resumeId))
      .returning();

    if (!resume) {
      throw new Error(`Resume not found: ${resumeId}`);
    }

    return resume;
  }
}

export const resumeRepository = new ResumeRepository();
