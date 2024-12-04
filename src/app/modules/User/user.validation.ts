import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createUserSchema = z.object({
  user: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    profilePhoto: z.string().optional(),
    password: z.string().min(8),
    role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
    needPasswordChange: z.boolean().default(true),
    status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
    lastLogin: z.date().nullable().optional(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  }),
  customer: z
    .object({
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  vendor: z
    .object({
      userId: z.string().uuid().optional(),
      shopName: z.string(),
      shopLogo: z.string().url().optional(),
      description: z.string().optional(),
      isBlacklisted: z.boolean().default(false),
      createdAt: z.date().default(new Date()),
      updatedAt: z.date().default(new Date()),
    })
    .optional(),
});

const createCustomerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  profilePhoto: z.string().optional(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
  needsPasswordChange: z.boolean().default(true),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
  lastLogin: z.date().nullable().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

const VendorSchema = z.object({
  userId: z.string().uuid().optional(),
  shopName: z.string(),
  shopLogo: z.string().url().optional(),
  description: z.string().optional(),
  isBlacklisted: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});
const createVendorSchema = z.object({
  body:z.object({
    name: z.string().min(1, "Name must be at least 3 characters long"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.nativeEnum(UserRole).default(UserRole.VENDOR),
    shopName: z.string().min(3, "Shop name must be at least 3 characters long"),
  })
  })
  

export const UserValidationSchemas = {
  createUserSchema,
  createCustomerSchema,
  createVendorSchema,
};
