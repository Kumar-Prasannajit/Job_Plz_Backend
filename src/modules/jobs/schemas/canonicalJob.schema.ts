import { z } from "zod";

import {
  SkillsSchema,
} from "../../resumes/schemas/canonicalResume.schema.js";

export const CANONICAL_JOB_SCHEMA_VERSION = "1.0.0";

const OptionalUrlSchema = z
  .url()
  .or(z.literal(""))
  .optional();

/* ============================================================================
 * Job
 * ==========================================================================*/

export const JobSchema = z.object({
  title: z.string().trim(),

  department: z.string().trim().optional(),

  employmentType: z.enum([
    "Full-time",
    "Part-time",
    "Internship",
    "Contract",
    "Freelance",
    "Temporary",
    "Apprenticeship",
    "Volunteer",
    "Self-employed",
    "Other",
  ]),

  workMode: z.enum([
    "On-site",
    "Hybrid",
    "Remote",
    "Unknown",
  ]),

  jobLevel: z.enum([
    "Intern",
    "Entry",
    "Associate",
    "Mid",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "VP",
    "Executive",
    "Other",
  ]),

  jobFunction: z.string().trim().optional(),

  summary: z.string().trim().default(""),
});

/* ============================================================================
 * Company
 * ==========================================================================*/

export const CompanySchema = z.object({
  name: z.string().trim(),

  website: OptionalUrlSchema,

  industry: z.string().trim().optional(),

  size: z.string().trim().optional(),

  description: z.string().trim().default(""),
});

/* ============================================================================
 * Location
 * ==========================================================================*/

export const LocationSchema = z.object({
  city: z.string().trim().optional(),

  state: z.string().trim().optional(),

  country: z.string().trim().optional(),

  relocation: z.boolean().default(false),

  visaSponsorship: z.boolean().default(false),
});

/* ============================================================================
 * Requirements
 * ==========================================================================*/

export const RequirementsSchema = z.object({
  minimumEducation: z.string().trim().optional(),

  preferredEducation: z.string().trim().optional(),

  minimumExperienceYears: z.number().min(0).optional(),

  preferredExperienceYears: z.number().min(0).optional(),

  requiredExperience: z.array(z.string().trim()).default([]),

  preferredExperience: z.array(z.string().trim()).default([]),

  certifications: z.array(z.string().trim()).default([]),

  languages: z.array(z.string().trim()).default([]),

  domainKnowledge: z.array(z.string().trim()).default([]),
});

/* ============================================================================
 * Responsibilities
 * ==========================================================================*/

export const ResponsibilitiesSchema = z.object({
  primary: z.array(z.string().trim()).default([]),

  secondary: z.array(z.string().trim()).default([]),

  leadership: z.array(z.string().trim()).default([]),

  communication: z.array(z.string().trim()).default([]),

  other: z.array(z.string().trim()).default([]),
});

/* ============================================================================
 * Compensation
 * ==========================================================================*/

export const CompensationSchema = z.object({
  currency: z.string().trim().optional(),

  minimumSalary: z.number().optional(),

  maximumSalary: z.number().optional(),

  salaryPeriod: z.enum([
    "Hourly",
    "Monthly",
    "Yearly",
  ]).optional(),

  bonus: z.boolean().default(false),

  equity: z.boolean().default(false),
});

/* ============================================================================
 * Benefits
 * ==========================================================================*/

export const BenefitsSchema = z.object({
  benefits: z.array(z.string().trim()).default([]),
});

/* ============================================================================
 * Metadata
 * ==========================================================================*/

export const MetadataSchema = z.object({
  parserVersion: z.string(),

  processedAt: z.string(),

  confidence: z.number().min(0).max(1).optional(),
});

/* ============================================================================
 * Canonical Job Schema
 * ==========================================================================*/

export const CanonicalJobSchema = z.object({
  job: JobSchema,

  company: CompanySchema,

  location: LocationSchema,

  requirements: RequirementsSchema,

  skills: SkillsSchema,

  responsibilities: ResponsibilitiesSchema,

  compensation: CompensationSchema,

  benefits: BenefitsSchema,

  metadata: MetadataSchema,
});

/* ============================================================================
 * Types
 * ==========================================================================*/

export type Job = z.infer<typeof JobSchema>;

export type Company = z.infer<typeof CompanySchema>;

export type Location = z.infer<typeof LocationSchema>;

export type Requirements = z.infer<typeof RequirementsSchema>;

export type Responsibilities = z.infer<typeof ResponsibilitiesSchema>;

export type Compensation = z.infer<typeof CompensationSchema>;

export type Benefits = z.infer<typeof BenefitsSchema>;

export type Metadata = z.infer<typeof MetadataSchema>;

export type CanonicalJob = z.infer<typeof CanonicalJobSchema>;