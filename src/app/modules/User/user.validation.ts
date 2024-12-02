import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createUserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  username: z.string().min(1).optional(),
  email: z.string().email(),
  profilePhoto: z.string().optional(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).default(UserRole.Customer),
  needPasswordChange: z.boolean().default(true),
  status: z.nativeEnum(UserStatus).default(UserStatus.Active),
  lastLogin: z.date().nullable().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export const UserValidationSchemas = {
  createUserSchema,
};
