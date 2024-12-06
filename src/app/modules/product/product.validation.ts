import { ProductType } from '@prisma/client';
import { z } from 'zod';

const electronicsProductSchema = z.object({
  brand: z.string(),
  model: z.string(),
  specifications: z.object({ // note: this is a JSON object, so we'll use z.object() to validate it
    // add any specific validation rules for the specifications object here, if needed
  }),
});


const productSchema = z.object({
  body:z.object({
    vendorId: z.string(),
    categoryId: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number(),
    type: z.nativeEnum(ProductType),
    inventory: z.number().int().nonnegative(),
    images: z.array(z.string()),
    discount: z.number().optional(),
    electronicsDetails: electronicsProductSchema.optional(),
  })
  });



const createProductSchema = z.object({
    body:z.object({
        vendorId: z.string().uuid(),
        categoryId: z.string().uuid(),
        name: z.string().min(1),
        brand: z.string().optional(),
        description: z.string(),
        price: z.number(),
        discountPercentage: z.number().optional(),
        inventoryCount: z.number(),
        electronicsDetails: electronicsProductSchema.optional(),
        isFlashSale: z.boolean().optional(),
        flashSalePrice: z.number().optional(),
        createdAt: z.date().default(new Date()),
        updatedAt: z.date().default(new Date()),
      })
})


  export const ProductValidationSchemas = {
    createProductSchema,
    productSchema
  };