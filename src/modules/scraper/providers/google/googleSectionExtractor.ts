// src/modules/scraper/providers/google/googleSectionExtractor.ts

export interface GoogleSections {
  version: string;
  extractedAt: string;

  title: string;
  location: string;
  level: string;

  minimumQualifications: string[];
  preferredQualifications: string[];

  about: string;
  responsibilities: string[];

  compensation: string;
}

class GoogleSectionExtractor {
  readonly version = "1.0.0";

  extract(rawText: string): GoogleSections {
    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      version: this.version,
      extractedAt: new Date().toISOString(),

      title: this.extractTitle(lines),
      location: this.extractLocation(lines),
      level: this.extractLevel(lines),

      minimumQualifications: this.extractBulletSection(
        rawText,
        "Minimum qualifications:",
        "Preferred qualifications:",
      ),

      preferredQualifications: this.extractBulletSection(
        rawText,
        "Preferred qualifications:",
        "About the job",
      ),

      about: this.extractAbout(rawText),

      responsibilities: this.extractBulletSection(
        rawText,
        "Responsibilities",
        "Information collected and processed",
      ),

      compensation: this.extractCompensation(rawText),
    };
  }

  private extractTitle(lines: string[]): string {
    return lines[0] ?? "";
  }

  private extractLocation(lines: string[]): string {
    const placeIndex = lines.findIndex(
      (line) => line === "place",
    );

    if (placeIndex >= 0) {
      return lines[placeIndex + 1] ?? "";
    }

    return "";
  }

  private extractLevel(lines: string[]): string {
    const levelIndex = lines.findIndex(
      (line) => line === "bar_chart",
    );

    if (levelIndex >= 0) {
      return lines[levelIndex + 1] ?? "";
    }

    return "";
  }

  private extractBulletSection(
    rawText: string,
    startMarker: string,
    endMarker: string,
  ): string[] {
    const start = rawText.indexOf(startMarker);

    if (start === -1) {
      return [];
    }

    const end = rawText.indexOf(
      endMarker,
      start + startMarker.length,
    );

    const section =
      end === -1
        ? rawText.slice(start + startMarker.length)
        : rawText.slice(
            start + startMarker.length,
            end,
          );

    return section
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private extractAbout(rawText: string): string {
    const startMarker = "About the job";
    const endMarker = "Responsibilities";

    const start = rawText.indexOf(startMarker);

    if (start === -1) {
      return "";
    }

    const end = rawText.indexOf(
      endMarker,
      start + startMarker.length,
    );

    if (end === -1) {
      return "";
    }

    return rawText
      .slice(start + startMarker.length, end)
      .trim();
  }

  private extractCompensation(
    rawText: string,
  ): string {
    const match = rawText.match(
      /\$[\d,]+\s*-\s*\$[\d,]+/,
    );

    return match?.[0] ?? "";
  }
}

export const googleSectionExtractor =
  new GoogleSectionExtractor();