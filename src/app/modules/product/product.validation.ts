import { z } from 'zod';

const createProductSchema = z.object({
    body:z.object({
        vendorId: z.string().uuid(),
        categoryId: z.string().uuid(),
        name: z.string().min(1),
        brand: z.string().optional(),
        description: z.string(),
        price: z.number(),
        discountPercentage: z.number().optional(),
        isFlashSale: z.boolean().optional(),
        inventoryCount: z.number(),
        isAvailable: z.boolean().default(true),
        flashSalePrice: z.number().optional(),
        createdAt: z.date().default(new Date()),
        updatedAt: z.date().default(new Date()),
      })
})


  export const ProductValidationSchemas = {
    createProductSchema,
  };