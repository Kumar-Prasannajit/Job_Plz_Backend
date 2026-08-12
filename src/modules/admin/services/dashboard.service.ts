// src/modules/admin/services/dashboard.service.ts

import { prisma } from "../../../config/database.js";

class DashboardService {
  async getOverview() {
    const [
      rawJobs,
      canonicalJobs,
      embeddings,
    ] = await Promise.all([
      prisma.rawJob.groupBy({
        by: ["status"],
        _count: true,
      }),

      prisma.job.count(),

      prisma.jobEmbedding.count(),
    ]);

    const stats = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    for (const row of rawJobs) {
      stats.total += row._count;

      switch (row.status) {
        case "PENDING":
          stats.pending = row._count;
          break;

        case "PROCESSING":
          stats.processing = row._count;
          break;

        case "COMPLETED":
          stats.completed = row._count;
          break;

        case "FAILED":
          stats.failed = row._count;
          break;
      }
    }

    return {
      rawJobs: stats,

      canonicalJobs: {
        total: canonicalJobs,
      },

      embeddings: {
        total: embeddings,
      },
    };
  }

  async getSources() {
    const rows = await prisma.rawJob.groupBy({
      by: ["platform", "status"],
      _count: true,
    });

    const result = new Map<
      string,
      {
        source: string;
        total: number;
        pending: number;
        processing: number;
        completed: number;
        failed: number;
      }
    >();

    for (const row of rows) {
      const source = row.platform ?? "Unknown";

      if (!result.has(source)) {
        result.set(source, {
          source,
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0,
        });
      }

      const item = result.get(source)!;

      item.total += row._count;

      switch (row.status) {
        case "PENDING":
          item.pending = row._count;
          break;

        case "PROCESSING":
          item.processing = row._count;
          break;

        case "COMPLETED":
          item.completed = row._count;
          break;

        case "FAILED":
          item.failed = row._count;
          break;
      }
    }

    return Array.from(result.values());
  }

  async getRecentJobs(limit = 20) {
    return prisma.rawJob.findMany({
      take: limit,

      orderBy: {
        scrapedAt: "desc",
      },

      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        platform: true,
        status: true,
        scrapedAt: true,
      },
    });
  }
}

export const dashboardService =
  new DashboardService();