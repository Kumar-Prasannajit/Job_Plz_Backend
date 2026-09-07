// src/modules/admin/services/dashboard.service.ts

import { dashboardRepository } from "../repositories/dashboard.repository.js";

class DashboardService {
  async getOverview() {
    const [rawJobsByStatus, canonicalJobs, embeddings] = await Promise.all([
      dashboardRepository.countRawJobsByStatus(),
      dashboardRepository.countJobs(),
      dashboardRepository.countJobEmbeddings(),
    ]);

    const stats = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    for (const row of rawJobsByStatus) {
      stats.total += row.count;

      switch (row.status) {
        case "PENDING":
          stats.pending = row.count;
          break;

        case "PROCESSING":
          stats.processing = row.count;
          break;

        case "COMPLETED":
          stats.completed = row.count;
          break;

        case "FAILED":
          stats.failed = row.count;
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
    const rows = await dashboardRepository.countRawJobsByPlatformAndStatus();

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

      item.total += row.count;

      switch (row.status) {
        case "PENDING":
          item.pending = row.count;
          break;

        case "PROCESSING":
          item.processing = row.count;
          break;

        case "COMPLETED":
          item.completed = row.count;
          break;

        case "FAILED":
          item.failed = row.count;
          break;
      }
    }

    return Array.from(result.values());
  }

  async getRecentJobs(limit = 20) {
    return dashboardRepository.findRecent(limit);
  }
}

export const dashboardService = new DashboardService();
