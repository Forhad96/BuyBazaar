import {z} from 'zod';



const createCartSchema = z.object({
body: z.object({
        productId: z.string().cuid(),
    quantity: z.number().int().nonnegative(),
})
});


const updateCartSchema = z.object({
body: z.object({
    quantity: z.number().int().nonnegative(),
})
});


export const CartValidationSchemas = {
    createCartSchema,
    updateCartSchema,
};