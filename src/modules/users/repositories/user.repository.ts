import { prisma } from "../../../config/database.js";
import type { Prisma, User } from "@prisma/client";

class UserRepository {

    async findByClerkId(clerkUserId: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                clerkUserId,
            },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async update(
        clerkUserId: string,
        data: Prisma.UserUpdateInput
    ): Promise<User> {
        return prisma.user.update({
            where: {
                clerkUserId,
            },
            data,
        });
    }

    async delete(clerkUserId: string): Promise<User> {
        return prisma.user.delete({
            where: {
                clerkUserId,
            },
        });
    }
}

export const userRepository = new UserRepository();