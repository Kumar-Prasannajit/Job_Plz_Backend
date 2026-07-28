import type { Prisma, User } from "@prisma/client";
import { userRepository } from "../repositories/user.repository.js";
import type { UserSyncDTO } from "../types/user.types.js";

class UserService {
  async syncCreatedUser(user: UserSyncDTO): Promise<User> {
    const existingUser = await userRepository.findByClerkId(user.clerkUserId);

    if (existingUser) {
      return existingUser;
    }

    return userRepository.create({
      clerkUserId: user.clerkUserId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    });
  }

  async syncUpdatedUser(user: UserSyncDTO): Promise<User> {
    return userRepository.update(user.clerkUserId, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    });
  }

  async syncDeletedUser(clerkUserId: string): Promise<User> {
    return userRepository.delete(clerkUserId);
  }
}

export const userService = new UserService();
