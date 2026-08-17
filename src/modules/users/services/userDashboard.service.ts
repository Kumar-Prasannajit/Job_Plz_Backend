import { resumeRepository } from "../../resumes/repositories/resume.repository.js";

class UserDashboardService {
  async getDashboard(
    userId: string,
  ) {
    const resumes =
      await resumeRepository.findByUserId(
        userId,
      );

    return {
      resumes: resumes.map(
        (resume) => ({
          id: resume.id,
          originalFileName:
            resume.originalFileName,

          createdAt:
            resume.createdAt,

          parserVersion:
            resume.parserVersion,
        }),
      ),
    };
  }
}

export const userDashboardService =
  new UserDashboardService();