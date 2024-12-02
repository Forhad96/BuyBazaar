import {z} from 'zod';
const zUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});


export const adminValidationSchemas ={
    zUpdateSchema
};