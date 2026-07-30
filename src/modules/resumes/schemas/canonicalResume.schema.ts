import { z } from "zod";

export const CANONICAL_RESUME_SCHEMA_VERSION = "1.0.0";

const OptionalUrlSchema = z
  .url()
  .or(z.literal(""))
  .optional();

/* ============================================================================
 * Personal Information
 * ==========================================================================*/

export const PersonalSchema = z.object({
  fullName: z.string().trim().default(""),

  firstName: z.string().trim().default(""),

  lastName: z.string().trim().default(""),

  jobTitle: z.string().trim().optional(),

  email: z.email().optional(),

  phone: z.string().trim().optional(),

  location: z
    .object({
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      country: z.string().trim().optional(),
    })
    .optional(),

  linkedIn: OptionalUrlSchema,

  github: OptionalUrlSchema,

  portfolio: OptionalUrlSchema,

  website: OptionalUrlSchema,

  leetcode: OptionalUrlSchema,

  hackerrank: OptionalUrlSchema,

  codeforces: OptionalUrlSchema,

  codechef: OptionalUrlSchema,

  stackoverflow: OptionalUrlSchema,
});

/* ============================================================================
 * Professional Summary
 * ==========================================================================*/

export const SummarySchema = z.string().trim().default("");

/* ============================================================================
 * Skills
 * ==========================================================================*/

export const SkillsSchema = z.object({
  languages: z.array(z.string().trim()).default([]),

  frontend: z.array(z.string().trim()).default([]),

  backend: z.array(z.string().trim()).default([]),

  database: z.array(z.string().trim()).default([]),

  cloud: z.array(z.string().trim()).default([]),

  devops: z.array(z.string().trim()).default([]),

  testing: z.array(z.string().trim()).default([]),

  ai: z.array(z.string().trim()).default([]),

  operatingSystems: z.array(z.string().trim()).default([]),

  mobile: z.array(z.string().trim()).default([]),

  tools: z.array(z.string().trim()).default([]),

  softSkills: z.array(z.string().trim()).default([]),

  miscellaneous: z.array(z.string().trim()).default([]),
});

/* ============================================================================
 * Experience
 * ==========================================================================*/

export const ExperienceSchema = z.object({
  company: z.string().trim(),

  jobTitle: z.string().trim(),

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

  location: z
    .object({
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      country: z.string().trim().optional(),
    })
    .optional(),

  startDate: z.string().trim(),

  endDate: z.string().trim().optional(),

  isCurrent: z.boolean().default(false),

  description: z.string().trim().default(""),

  responsibilities: z.array(z.string().trim()).default([]),

  achievements: z.array(z.string().trim()).default([]),

  technologies: z.array(z.string().trim()).default([]),

  domain: z.array(z.string().trim()).default([]),
});

export const ExperiencesSchema = z.array(ExperienceSchema).default([]);

/* ============================================================================
 * Education
 * ==========================================================================*/

export const EducationSchema = z.object({
  institution: z.string().trim(),

  degree: z.string().trim(),

  fieldOfStudy: z.string().trim().optional(),

  educationLevel: z.enum([
    "High School",
    "Diploma",
    "Associate",
    "Bachelor",
    "Master",
    "Doctorate",
    "Certification",
    "Other",
  ]),

  startDate: z.string().trim().optional(),

  endDate: z.string().trim().optional(),

  isCurrentlyStudying: z.boolean().default(false),

  grade: z
    .object({
      value: z.string().trim().optional(),

      type: z.enum(["CGPA", "Percentage", "GPA", "Grade", "Other"]).optional(),

      maxValue: z.number().optional(),
    })
    .optional(),

  location: z
    .object({
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      country: z.string().trim().optional(),
    })
    .optional(),

  achievements: z.array(z.string().trim()).default([]),

  coursework: z.array(z.string().trim()).default([]),
});

export const EducationsSchema = z.array(EducationSchema).default([]);

/* ============================================================================
 * Projects
 * ==========================================================================*/

export const ProjectSchema = z.object({
  title: z.string().trim(),

  description: z.string().trim().default(""),

  role: z.string().trim().optional(),

  organization: z.string().trim().optional(),

  startDate: z.string().trim().optional(),

  endDate: z.string().trim().optional(),

  isOngoing: z.boolean().default(false),

  technologies: z.array(z.string().trim()).default([]),

  domain: z.array(z.string().trim()).default([]),

  responsibilities: z.array(z.string().trim()).default([]),

  achievements: z.array(z.string().trim()).default([]),

  githubUrl: OptionalUrlSchema,

  liveUrl: OptionalUrlSchema,

  demoUrl: OptionalUrlSchema,
});

export const ProjectsSchema = z.array(ProjectSchema).default([]);

/* ============================================================================
 * Certifications
 * ==========================================================================*/

export const CertificationSchema = z.object({
  name: z.string().trim(),

  issuingOrganization: z.string().trim(),

  issueDate: z.string().trim().optional(),

  expiryDate: z.string().trim().optional(),

  credentialId: z.string().trim().optional(),

  credentialUrl: OptionalUrlSchema,

  skills: z.array(z.string().trim()).default([]),
});

export const CertificationsSchema = z.array(CertificationSchema).default([]);

/* ============================================================================
 * Achievements
 * ==========================================================================*/

export const AchievementSchema = z.object({
  title: z.string().trim(),

  description: z.string().trim().optional(),

  date: z.string().trim().optional(),

  organization: z.string().trim().optional(),
});

export const AchievementsSchema = z.array(AchievementSchema).default([]);

/* ============================================================================
 * Spoken Languages
 * ==========================================================================*/

export const LanguageSchema = z.object({
  language: z.string().trim(),

  proficiency: z.enum([
    "Native",
    "Fluent",
    "Professional",
    "Intermediate",
    "Basic",
  ]),
});

export const LanguagesSchema = z.array(LanguageSchema).default([]);

/* ============================================================================
 * Metadata
 * ==========================================================================*/

export const MetadataSchema = z.object({
  parserVersion: z.string(),

  extractedAt: z.string(),

  sourceFileName: z.string().optional(),

  confidence: z.number().min(0).max(1).optional(),
});

/* ============================================================================
 * Canonical Resume Schema
 * ==========================================================================*/

export const CanonicalResumeSchema = z.object({
  personal: PersonalSchema,

  summary: SummarySchema,

  skills: SkillsSchema,

  experience: ExperiencesSchema,

  education: EducationsSchema,

  projects: ProjectsSchema,

  certifications: CertificationsSchema,

  achievements: AchievementsSchema,

  languages: LanguagesSchema,

  metadata: MetadataSchema,
});

/* ============================================================================
 * Types
 * ==========================================================================*/

export type Personal = z.infer<typeof PersonalSchema>;

export type Skills = z.infer<typeof SkillsSchema>;

export type Experience = z.infer<typeof ExperienceSchema>;

export type Education = z.infer<typeof EducationSchema>;

export type Project = z.infer<typeof ProjectSchema>;

export type Certification = z.infer<typeof CertificationSchema>;

export type Achievement = z.infer<typeof AchievementSchema>;

export type Language = z.infer<typeof LanguageSchema>;

export type Metadata = z.infer<typeof MetadataSchema>;

export type CanonicalResume = z.infer<typeof CanonicalResumeSchema>;