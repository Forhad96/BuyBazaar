import { z } from "zod";

export const createVendorSchema = z.object({
  ownerId: z.string().uuid(),
  shopName: z.string().min(3, "Shop name must be at least 3 characters long"),
  shopLogo: z.string().url().optional(),
  description: z.string().optional(),
  followersCount: z.string().optional(),
  isBlacklisted: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const VendorValidationSchemas = {
  createVendorSchema,
};
