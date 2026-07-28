import type { Resume } from "@prisma/client";

import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";
import {
    resumeRepository,
    type CreateResumeInput,
} from "../repositories/resume.repository.js";

class ResumeService {

    async uploadResume(
        userId: string,
        file: Express.Multer.File
    ): Promise<Resume> {

        const uploadResult = await uploadToCloudinary(
            file.buffer,
            "resumes"
        );

        const resumeData: CreateResumeInput = {
            userId,
            originalFileName: file.originalname,
            cloudinaryUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
        };

        return resumeRepository.create(resumeData);

    }

}

export const resumeService = new ResumeService();