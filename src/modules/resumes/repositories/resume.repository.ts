import type { Resume } from "@prisma/client";

import { prisma } from "../../../config/database.js";
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
  return prisma.resume.create({
    data: {
      userId: data.userId,
      originalFileName: data.originalFileName,
      cloudinaryUrl: data.cloudinaryUrl,
      cloudinaryId: data.cloudinaryId,
      parsedData: data.parsedData,
      parserVersion: data.parserVersion,
    },
  });
}

  async findByUserId(userId: string): Promise<Resume[]> {
    return prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const resumeRepository = new ResumeRepository();
