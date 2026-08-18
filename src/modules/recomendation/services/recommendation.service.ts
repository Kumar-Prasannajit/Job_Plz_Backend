import type { CanonicalJob } from "../../jobs/schemas/canonicalJob.schema.js";

import { embeddingRepository } from "../../embeddings/embedding.repository.js";
import { resumeRepository } from "../../resumes/repositories/resume.repository.js";
import { jobRepository } from "../../jobs/repositories/job.repository.js";
import { recommendationRepository } from "../repositories/recommendation.repository.js";

interface JobScore {
  skills: number;
  experience: number;
  project: number;
  education: number;
  certification: number;
  language: number;
  achievement: number;
}

function createEmptyScore(): JobScore {
  return {
    skills: 0,
    experience: 0,
    project: 0,
    education: 0,
    certification: 0,
    language: 0,
    achievement: 0,
  };
}

function calculateMatchPercentage(score: JobScore): number {
  return Math.round(
    score.skills * 35 +
      score.experience * 30 +
      score.project * 15 +
      score.education * 10 +
      score.certification * 5 +
      score.language * 3 +
      score.achievement * 2,
  );
}

const SECTION_MAPPING = {
  SKILLS: ["SKILLS"],

  EXPERIENCE: ["REQUIREMENTS"],

  PROJECT: ["RESPONSIBILITIES"],

  EDUCATION: ["REQUIREMENTS"],

  CERTIFICATION: ["REQUIREMENTS"],

  LANGUAGE: ["REQUIREMENTS"],

  ACHIEVEMENT: ["RESPONSIBILITIES"],
} as const;

export interface RecommendedJob {
  jobId: string;

  score: number;

  matchPercentage: number;

  title: string;

  company: string;

  location: string;
}

class RecommendationService {
  async recommend(resumeId: string): Promise<RecommendedJob[]> {
    const resumeChunks = await embeddingRepository.findByResumeId(resumeId);

    if (resumeChunks.length === 0) {
      return [];
    }

    const scores = new Map<string, JobScore>();

    for (const chunk of resumeChunks) {
      if (chunk.chunkType === "SUMMARY") {
        continue;
      }

      const embedding = JSON.parse(chunk.embedding) as number[];

      const targetChunkTypes =
        SECTION_MAPPING[chunk.chunkType as keyof typeof SECTION_MAPPING];

      if (!targetChunkTypes) {
        continue;
      }

      const matches = await recommendationRepository.findSimilarJobChunks(
        embedding,
        [...targetChunkTypes],
        10,
      );

      for (const match of matches) {
        const current = scores.get(match.jobId) ?? createEmptyScore();

        switch (chunk.chunkType) {
          case "SKILLS":
            current.skills = Math.max(current.skills, match.similarity);
            break;

          case "EXPERIENCE":
            current.experience = Math.max(current.experience, match.similarity);
            break;

          case "PROJECT":
            current.project = Math.max(current.project, match.similarity);
            break;

          case "EDUCATION":
            current.education = Math.max(current.education, match.similarity);
            break;

          case "CERTIFICATION":
            current.certification = Math.max(
              current.certification,
              match.similarity,
            );
            break;

          case "LANGUAGE":
            current.language = Math.max(current.language, match.similarity);
            break;

          case "ACHIEVEMENT":
            current.achievement = Math.max(
              current.achievement,
              match.similarity,
            );
            break;
        }

        scores.set(match.jobId, current);
      }
    }

    const rankedJobs = [...scores.entries()]
      .map(([jobId, score]) => ({
        jobId,
        score,
        matchPercentage: calculateMatchPercentage(score),
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 20);
    const jobs = await Promise.all(
      rankedJobs.map((job) => jobRepository.findById(job.jobId)),
    );

    const jobMap = new Map(
      jobs
        .filter((job): job is NonNullable<typeof job> => job !== null)
        .map((job) => [job.id, job]),
    );

    return rankedJobs
      .map((job) => {
        const dbJob = jobMap.get(job.jobId);

        if (!dbJob) {
          return null;
        }

        const canonical = dbJob.canonicalData as CanonicalJob;

        const location = [
          canonical.location.city,
          canonical.location.state,
          canonical.location.country,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          jobId: job.jobId,

          score: Number(
            (
              job.score.skills +
              job.score.experience +
              job.score.project +
              job.score.education +
              job.score.certification +
              job.score.language +
              job.score.achievement
            ).toFixed(4),
          ),

          matchPercentage: job.matchPercentage,

          title: canonical.job.title,

          company: canonical.company.name,

          location: location || "Unknown",
        };
      })
      .filter((job): job is RecommendedJob => job !== null);
  }

  async recommendForUser(userId: string): Promise<RecommendedJob[]> {
    const resumes = await resumeRepository.findByUserId(userId);

    const latestResume = resumes[0];

    if (!latestResume) {
      return [];
    }

    return this.recommend(latestResume.id);
  }
}

export const recommendationService = new RecommendationService();
