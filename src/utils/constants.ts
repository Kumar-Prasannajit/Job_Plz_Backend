// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

// File Upload
export const FILE_LIMITS = {
    MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB
};

export const ALLOWED_RESUME_TYPES = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
] as const;

export const ALLOWED_RESUME_EXTENSIONS = [
    ".pdf",
    ".doc",
    ".docx",
] as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// Queue Names
export const QUEUES = {
    SCRAPER: "scraper-queue",
    EMBEDDING: "embedding-queue",
};

// Job
export const JOB_EXPIRY_DAYS = 7;

// Environment
export const NODE_ENV = {
    DEVELOPMENT: "development",
    PRODUCTION: "production",
    TEST: "test",
} as const;

// Time
export const TIME = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
} as const;