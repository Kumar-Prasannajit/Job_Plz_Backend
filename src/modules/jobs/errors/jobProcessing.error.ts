// Postgres SQLSTATE code for unique_violation, raised by the `pg` driver as
// a plain Error with a `.code` property (there's no wrapper exception class
// like Prisma's PrismaClientKnownRequestError to catch here).
const PG_UNIQUE_VIOLATION = "23505";

function isPgErrorWithCode(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export class JobProcessingError {
  static isRetryable(
    error: unknown,
  ): boolean {
    // Postgres duplicate key
    if (isPgErrorWithCode(error) && error.code === PG_UNIQUE_VIOLATION) {
      return false;
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