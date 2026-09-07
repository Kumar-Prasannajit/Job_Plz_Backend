import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums (names/values match the Postgres types already created by Prisma's
// migrations — do not rename without a matching migration)
// ---------------------------------------------------------------------------

export const userRole = pgEnum("UserRole", ["USER", "RECRUITER", "ADMIN"]);

export const chunkType = pgEnum("ChunkType", [
  "SUMMARY",
  "SKILLS",
  "EXPERIENCE",
  "PROJECT",
  "EDUCATION",
  "CERTIFICATION",
  "ACHIEVEMENT",
  "LANGUAGE",
]);

export const jobChunkType = pgEnum("JobChunkType", [
  "JOB_SUMMARY",
  "REQUIREMENTS",
  "SKILLS",
  "RESPONSIBILITIES",
]);

export const rawJobStatus = pgEnum("RawJobStatus", [
  "PENDING",
  "QUEUED",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

// ---------------------------------------------------------------------------
// Shared column helpers
// ---------------------------------------------------------------------------

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

const timestamps = {
  // createdAt has a real DB-level default (Prisma's migration added
  // DEFAULT CURRENT_TIMESTAMP), so .defaultNow() is safe here.
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  // updatedAt has NO DB-level default — Prisma's @updatedAt was purely
  // client-side. Use $defaultFn (insert) + $onUpdate (update) to generate
  // it app-side instead, matching the column as it actually exists.
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
};

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: id(),
    clerkUserId: text("clerkUserId").notNull(),
    email: text("email").notNull(),

    firstName: text("firstName"),
    lastName: text("lastName"),
    imageUrl: text("imageUrl"),

    role: userRole("role").default("USER").notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_clerkUserId_key").on(table.clerkUserId),
    uniqueIndex("users_email_key").on(table.email),
  ],
);

export const resumes = pgTable(
  "resumes",
  {
    id: id(),
    userId: text("userId").notNull(),

    originalFileName: text("originalFileName").notNull(),
    cloudinaryUrl: text("cloudinaryUrl").notNull(),
    cloudinaryId: text("cloudinaryId").notNull(),

    parsedData: jsonb("parsedData"),
    parserVersion: text("parserVersion"),

    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "resumes_userId_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const resumeEmbeddings = pgTable(
  "resume_embeddings",
  {
    id: id(),
    resumeId: text("resumeId").notNull(),

    chunkType: chunkType("chunkType").notNull(),
    chunkIndex: integer("chunkIndex").notNull(),
    chunkContent: text("chunkContent").notNull(),

    embedding: vector("embedding", { dimensions: 768 }).notNull(),

    metadata: jsonb("metadata"),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("resume_embeddings_resumeId_chunkIndex_key").on(
      table.resumeId,
      table.chunkIndex,
    ),
    index("resume_embeddings_resumeId_idx").on(table.resumeId),
    index("resume_embeddings_chunkType_idx").on(table.chunkType),
    foreignKey({
      columns: [table.resumeId],
      foreignColumns: [resumes.id],
      name: "resume_embeddings_resumeId_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const rawJobs = pgTable(
  "raw_jobs",
  {
    id: id(),

    jobUrl: text("jobUrl").notNull(),

    platform: text("platform"),
    platformJobId: text("platformJobId"),

    companyName: text("companyName").notNull(),
    companyWebsite: text("companyWebsite"),
    companyLogoUrl: text("companyLogoUrl"),

    jobTitle: text("jobTitle").notNull(),

    rawHtml: text("rawHtml"),
    rawText: text("rawText").notNull(),
    rawJson: jsonb("rawJson"),

    location: text("location"),

    status: rawJobStatus("status").default("PENDING").notNull(),

    parserVersion: text("parserVersion"),

    processedAt: timestamp("processedAt", { precision: 3, mode: "date" }),

    failureReason: text("failureReason"),

    contentHash: text("contentHash").notNull(),

    metadata: jsonb("metadata"),

    scrapedAt: timestamp("scrapedAt", {
      precision: 3,
      mode: "date",
    }).notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("raw_jobs_jobUrl_key").on(table.jobUrl),
    uniqueIndex("raw_jobs_contentHash_key").on(table.contentHash),
    index("raw_jobs_companyName_idx").on(table.companyName),
    index("raw_jobs_jobTitle_idx").on(table.jobTitle),
    index("raw_jobs_status_idx").on(table.status),
    index("raw_jobs_scrapedAt_idx").on(table.scrapedAt),
  ],
);

export const jobs = pgTable(
  "jobs",
  {
    id: id(),
    rawJobId: text("rawJobId").notNull(),

    canonicalData: jsonb("canonicalData").notNull(),
    schemaVersion: text("schemaVersion").notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("jobs_rawJobId_key").on(table.rawJobId),
    index("jobs_schemaVersion_idx").on(table.schemaVersion),
    foreignKey({
      columns: [table.rawJobId],
      foreignColumns: [rawJobs.id],
      name: "jobs_rawJobId_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const jobEmbeddings = pgTable(
  "job_embeddings",
  {
    id: id(),
    jobId: text("jobId").notNull(),

    chunkType: jobChunkType("chunkType").notNull(),
    chunkIndex: integer("chunkIndex").notNull(),
    chunkContent: text("chunkContent").notNull(),

    embedding: vector("embedding", { dimensions: 768 }).notNull(),

    metadata: jsonb("metadata"),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("job_embeddings_jobId_chunkIndex_key").on(
      table.jobId,
      table.chunkIndex,
    ),
    index("job_embeddings_jobId_idx").on(table.jobId),
    index("job_embeddings_chunkType_idx").on(table.chunkType),
    foreignKey({
      columns: [table.jobId],
      foreignColumns: [jobs.id],
      name: "job_embeddings_jobId_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

// ---------------------------------------------------------------------------
// Relations (used for the one `include` the old Prisma code relied on:
// job.repository.ts's findById -> rawJob)
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  embeddings: many(resumeEmbeddings),
}));

export const resumeEmbeddingsRelations = relations(
  resumeEmbeddings,
  ({ one }) => ({
    resume: one(resumes, {
      fields: [resumeEmbeddings.resumeId],
      references: [resumes.id],
    }),
  }),
);

export const rawJobsRelations = relations(rawJobs, ({ one }) => ({
  job: one(jobs, {
    fields: [rawJobs.id],
    references: [jobs.rawJobId],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  rawJob: one(rawJobs, {
    fields: [jobs.rawJobId],
    references: [rawJobs.id],
  }),
  embeddings: many(jobEmbeddings),
}));

export const jobEmbeddingsRelations = relations(jobEmbeddings, ({ one }) => ({
  job: one(jobs, {
    fields: [jobEmbeddings.jobId],
    references: [jobs.id],
  }),
}));

// ---------------------------------------------------------------------------
// Inferred types (replaces the generated `@prisma/client` model types)
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

export type ResumeEmbedding = typeof resumeEmbeddings.$inferSelect;
export type NewResumeEmbedding = typeof resumeEmbeddings.$inferInsert;

export type RawJob = typeof rawJobs.$inferSelect;
export type NewRawJob = typeof rawJobs.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type JobEmbedding = typeof jobEmbeddings.$inferSelect;
export type NewJobEmbedding = typeof jobEmbeddings.$inferInsert;
