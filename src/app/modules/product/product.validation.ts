import { ProductType } from '@prisma/client';
import { z } from 'zod';

const electronicsProductSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  specifications: z.object({ // note: this is a JSON object, so we'll use z.object() to validate it
    // add any specific validation rules for the specifications object here, if needed
  }),
});


const productSchema = z.object({

    vendorId: z.string(),
    categoryId: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number(),
    type: z.nativeEnum(ProductType),
    inventory: z.number().int().nonnegative(),
    images: z.array(z.string()).optional(),
    discount: z.number().optional(),
    electronicsDetails: electronicsProductSchema.optional(),
  });


  const updatedProductSchema = z.object({
    vendorId: z.string().uuid(),
    categoryId: z.string().uuid(),
    name: z.string().min(1).max(100),
    description: z.string().max(500),
    price: z.number().positive(),
    type: z.nativeEnum(ProductType),
    inventory: z.number().int().nonnegative().max(1000),
    images: z.array(z.string().url()),
    discount: z.number().min(0).max(100),
    electronicsDetails: electronicsProductSchema.partial(),
  }).partial();


  export const ProductValidationSchemas = {
    productSchema,
    updatedProductSchema,
  };