import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"), // Assuming a minimum length for passwords
  
  // Security Fields
  needPasswordChange: z.boolean().default(true),
  lastPasswordChange: z.date().default(new Date()).optional(),
  passwordAttempts: z.number().int().nonnegative().default(0).optional(),
  isLocked: z.boolean().default(false).optional(),
  lockoutEnd: z.date().nullable().optional(),

  // Basic User Fields
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
  name: z.string(),
  profilePicture: z.string().url().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),

  // Address Fields
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),

  // Account Management
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),

  // Timestamps
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
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
const createAdminSchema = z.object({
  body:z.object({
    name: z.string().min(1, "Name must be at least 3 characters long"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.nativeEnum(UserRole).default(UserRole.ADMIN),

  })
  })

  const updateUserSchema = createUserSchema.partial()
  

export const UserValidationSchemas = {
  createUserSchema,
  updateUserSchema,
  createVendorSchema,
  createAdminSchema
};
