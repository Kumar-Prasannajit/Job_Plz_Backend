import { sql } from "drizzle-orm";

import { db } from "../db/client.js";

export const connectDB = async (): Promise<void> => {
    try {
        await db.execute(sql`select 1`);
        console.log("✅ PostgreSQL connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};
