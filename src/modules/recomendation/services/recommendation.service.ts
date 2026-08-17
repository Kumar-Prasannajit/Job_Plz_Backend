import type { CanonicalJob } from "../../jobs/schemas/canonicalJob.schema.js";

import { embeddingRepository } from "../../embeddings/embedding.repository.js";
import { resumeRepository } from "../../resumes/repositories/resume.repository.js";
import { jobRepository } from "../../jobs/repositories/job.repository.js";
import { recommendationRepository } from "../repositories/recommendation.repository.js";

export interface RecommendedJob {
  jobId: string;
  score: number;
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

    const scores = new Map<string, number>();

    for (const chunk of resumeChunks) {
      const embedding = JSON.parse(chunk.embedding) as number[];

      const matches = await recommendationRepository.findSimilarJobChunks(
        embedding,
        20,
      );

      for (const match of matches) {
        const current = scores.get(match.jobId) ?? 0;

        scores.set(match.jobId, current + match.similarity);
      }
    }

    const rankedJobs = [...scores.entries()]
      .map(([jobId, score]) => ({
        jobId,
        score,
      }))
      .sort((a, b) => b.score - a.score)
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

          score: Number(job.score.toFixed(4)),

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
