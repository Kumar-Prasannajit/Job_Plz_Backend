// src/modules/scraper/providers/google/googleCanonicalMapper.ts
import type { RawJob } from "@prisma/client";
import type { CanonicalJob } from "../../../jobs/schemas/canonicalJob.schema.js";

import type { GoogleSections } from "./googleSectionExtractor.js";

class GoogleCanonicalMapper {
  toCanonicalJob(sections: GoogleSections, rawJob: RawJob): CanonicalJob {
    const [city = "", state = "", country = ""] = sections.location
      .split(",")
      .map((part) => part.trim());

    return {
      job: {
        title: sections.title,

        summary: sections.about.slice(0, 500),

        department: "",

        employmentType: "Full-time",

        workMode: "Unknown",

        jobLevel: this.mapLevel(sections.level),

        jobFunction: "",
      },

      company: {
        name: rawJob.companyName,

        website: rawJob.companyWebsite ?? "",

        industry: "Technology",

        size: "",

        description: "",
      },

      location: {
        city,
        state,
        country,

        relocation: false,

        visaSponsorship: false,
      },

      requirements: {
        minimumEducation: sections.minimumQualifications[0] ?? "",

        preferredEducation: sections.preferredQualifications[0] ?? "",

        minimumExperienceYears: this.extractYears(
          sections.minimumQualifications,
        ),

        preferredExperienceYears: this.extractYears(
          sections.preferredQualifications,
        ),

        requiredExperience: sections.minimumQualifications,

        preferredExperience: sections.preferredQualifications,

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
        primary: sections.responsibilities,

        secondary: [],

        leadership: [],

        communication: [],

        other: [],
      },

      compensation: {
        currency: sections.compensation ? "USD" : undefined,

        minimumSalary: this.extractMinSalary(sections.compensation),

        maximumSalary: this.extractMaxSalary(sections.compensation),

        salaryPeriod: sections.compensation ? "Yearly" : null,

        bonus: false,

        equity: false,
      },

      benefits: {
        benefits: [],
      },

      metadata: {
        parserVersion: sections.version,

        processedAt: sections.extractedAt,
      },
    };
  }

  private mapLevel(level: string): CanonicalJob["job"]["jobLevel"] {
    switch (level.toLowerCase()) {
      case "early":
        return "Entry";

      case "mid":
        return "Mid";

      case "advanced":
        return "Senior";

      default:
        return "Other";
    }
  }

  private extractYears(qualifications: string[]): number | undefined {
    const text = qualifications.join(" ");

    const match = text.match(/(\d+)\s+years?/i);

    return match ? Number(match[1]) : undefined;
  }

  private extractMinSalary(compensation: string): number | undefined {
    const matches = compensation.match(/\$([\d,]+)/g);

    if (!matches?.length) {
      return undefined;
    }

    return Number(matches[0].replace(/[$,]/g, ""));
  }

  private extractMaxSalary(compensation: string): number | undefined {
    const matches = compensation.match(/\$([\d,]+)/g);

    if (!matches || matches.length < 2) {
      return undefined;
    }

    const maxSalary = matches?.[1];

    if (!maxSalary) {
      return undefined;
    }

    return Number(maxSalary.replace(/[$,]/g, ""));
  }
}

export const googleCanonicalMapper = new GoogleCanonicalMapper();
