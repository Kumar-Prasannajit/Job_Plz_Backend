import type { Resume } from "@prisma/client";

import { prisma } from "../../../config/database.js";

export interface CreateResumeInput {
    userId: string;
    originalFileName: string;
    cloudinaryUrl: string;
    cloudinaryId: string;
}

class ResumeRepository {

    async create(data: CreateResumeInput): Promise<Resume> {

        return prisma.resume.create({
            data,
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