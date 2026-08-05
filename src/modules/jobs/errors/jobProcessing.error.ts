import { Prisma } from "@prisma/client";

export class JobProcessingError {
  static isRetryable(
    error: unknown,
  ): boolean {
    // Prisma duplicate
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2002") {
        return false;
      }

      return true;
    }

    if (!(error instanceof Error)) {
      return true;
    }

    const message = error.message.toLowerCase();

    // Gemini rate limit
    if (
      message.includes("429") ||
      message.includes("resource_exhausted") ||
      message.includes("quota")
    ) {
      return true;
    }

    // Network
    if (
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("socket") ||
      message.includes("fetch")
    ) {
      return true;
    }

    // Validation
    if (
      message.includes("validation")
    ) {
      return false;
    }

    // Missing data
    if (
      message.includes("not found")
    ) {
      return false;
    }

    // Default
    return true;
  }
}