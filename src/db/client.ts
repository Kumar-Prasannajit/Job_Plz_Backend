import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../config/env.js";
import * as schema from "./schema.js";

const globalForDrizzle = globalThis as {
  drizzlePool?: Pool;
};

const pool =
  globalForDrizzle.drizzlePool ??
  new Pool({
    connectionString: env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.drizzlePool = pool;
}

export const db = drizzle(pool, { schema });
