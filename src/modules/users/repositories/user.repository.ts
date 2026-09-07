import { eq } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { users } from "../../../db/schema.js";
import type { NewUser, User } from "../../../db/schema.js";

class UserRepository {
  async findByClerkId(clerkUserId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    return user ?? null;
  }

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();

    if (!user) {
      throw new Error("Failed to create user.");
    }

    return user;
  }

  async update(
    clerkUserId: string,
    data: Partial<NewUser>,
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.clerkUserId, clerkUserId))
      .returning();

    if (!user) {
      throw new Error(`User not found: ${clerkUserId}`);
    }

    return user;
  }

  async delete(clerkUserId: string): Promise<User> {
    const [user] = await db
      .delete(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .returning();

    if (!user) {
      throw new Error(`User not found: ${clerkUserId}`);
    }

    return user;
  }
}

export const userRepository = new UserRepository();
