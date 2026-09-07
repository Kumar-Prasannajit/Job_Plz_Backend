import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: process.env.DATABASE_URL!,

  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET!,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  GEMINI_MODEL: process.env.GEMINI_MODEL!,

  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  OLLAMA_EMBEDDING_MODEL:
    process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",

  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};

const REQUIRED_ENV_KEYS: (keyof typeof env)[] = [
  "DATABASE_URL",

  "CLERK_SECRET_KEY",
  "CLERK_PUBLISHABLE_KEY",
  "CLERK_WEBHOOK_SECRET",

  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",

  "GEMINI_API_KEY",
  "GEMINI_MODEL",
];

function validateEnv(): void {
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);

  if (missingKeys.length > 0) {
    console.error("❌ Missing required environment variables:");

    for (const key of missingKeys) {
      console.error(`   - ${key}`);
    }

    console.error("\nCheck your .env file against .env.example.");

    process.exit(1);
  }
}

validateEnv();
