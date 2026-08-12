import type { Job, RawJob } from "@prisma/client";

import { normalizeJob } from "../normalizers/normalizeJob.js";

import { jobEmbeddingRepository } from "../embeddings/jobEmbedding.repository.js";
import { jobEmbeddingService } from "../embeddings/jobEmbedding.service.js";

import { jobRepository } from "../repositories/job.repository.js";
import { jobCanonicalProviderRegistry } from "../providers/jobCanonicalProviderRegistry.js";

import { jobValidatorService } from "./jobValidator.service.js";

class JobService {
  async process(rawJob: RawJob): Promise<Job> {
    console.log("\n========================================");
    console.log("🚀 Starting Job Processing Pipeline");
    console.log("========================================");

    console.log("\n📄 Step 1: Raw Job");
    console.log({
      id: rawJob.id,
      title: rawJob.jobTitle,
      company: rawJob.companyName,
      url: rawJob.jobUrl,
    });

    console.log("\n🔍 Step 2: Checking Existing Canonical Job...");

    console.log("\n🔄 Step 3: Mapping Raw Job → Canonical Job...");

    if (!rawJob.platform) {
      throw new Error(`RawJob ${rawJob.id} does not have a platform`);
    }

    const provider = jobCanonicalProviderRegistry.get(rawJob.platform);

    const canonicalJob = await provider.map(rawJob);

    console.log("✅ Canonical mapping completed");

    console.dir(canonicalJob, {
      depth: null,
    });

    console.log("\n🧹 Step 4: Normalizing...");
    const normalizedJob = normalizeJob(canonicalJob);
    console.log("✅ Normalization completed");
    console.dir(normalizedJob, { depth: null });

    console.log("\n✔️ Step 5: Validating...");
    const validatedJob = jobValidatorService.validate(normalizedJob);
    console.log("✅ Validation completed");

    console.log("\n💾 Step 6: Saving Canonical Job...");

    const savedJob = await jobRepository.create(rawJob.id, validatedJob);

    console.log("✅ Canonical Job created");

    console.log(savedJob);

    console.log("\n📝 Step 7: Formatting for Embedding...");
    const embeddings =
      await jobEmbeddingService.generateEmbeddings(validatedJob);

    console.log(`✅ Generated ${embeddings.length} embedding chunk(s)`);

    embeddings.forEach((chunk, index) => {
      console.log(`\nChunk ${index}`);
      console.log("-------------------------");
      console.log("Type:", chunk.chunkType);
      console.log("Content:");
      console.log(chunk.content);
      console.log("Embedding Dimension:", chunk.embedding.length);
    });

    console.log("\n🧠 Step 8: Saving Embeddings...");
    await jobEmbeddingRepository.replaceEmbeddings(savedJob.id, embeddings);

    console.log("✅ Embeddings saved");

    console.log("\n🎉 Job Processing Completed Successfully");
    console.log("========================================\n");

    return savedJob;
  }
}

export const jobService = new JobService();
