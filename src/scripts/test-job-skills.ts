import { normalizeJob } from "../modules/jobs/normalizers/normalizeJob.js";

const job = {
  job: {
    title: "Full Stack Developer",
    summary:
      "Looking for a developer with React, Node.js, PostgreSQL, Docker and AWS experience.",
    jobLevel: "Mid",
    workMode: "Remote",
    department: "",
    jobFunction: "",
    employmentType: "Full-time",
  },

  company: {
    name: "Test Company",
    website: "",
    industry: "",
    size: "",
    description: "",
  },

  location: {
    city: "",
    state: "",
    country: "",
    relocation: false,
    visaSponsorship: false,
  },

  requirements: {
    minimumEducation: "",
    preferredEducation: "",

    minimumExperienceYears: 2,
    preferredExperienceYears: 0,

    requiredExperience: [
      "Experience with React",
      "Experience with Node.js",
      "Experience with PostgreSQL",
      "Experience with Docker",
      "Experience with AWS",
    ],

    preferredExperience: [],

    certifications: [],
    languages: [],
    domainKnowledge: [],
  },

  skills: {
    ai: [],
    cloud: [],
    tools: [],
    devops: [],
    mobile: [],
    backend: [],
    testing: [],
    database: [],
    frontend: [],
    languages: [],
    softSkills: [],
    miscellaneous: [],
    operatingSystems: [],
  },

  responsibilities: {
    primary: [
      "Build React applications",
      "Develop Node.js APIs",
      "Manage PostgreSQL databases",
    ],
    secondary: [],
    leadership: [],
    communication: [],
    other: [],
  },

  compensation: {
    currency: "USD",
    minimumSalary: 100000,
    maximumSalary: 150000,
    salaryPeriod: "Yearly",
    bonus: false,
    equity: false,
  },

  benefits: {
    benefits: [],
  },

  metadata: {
    parserVersion: "1.0.0",
    processedAt: new Date().toISOString(),
  },
};

const normalized = normalizeJob(job as any);

console.dir(normalized.skills, {
  depth: null,
});