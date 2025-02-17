import z from 'zod';

// Product validation schema
export const productValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    shopId: z.string({
      required_error: 'Shop ID is required',
      invalid_type_error: 'Shop ID must be a string',
    }),
    description: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    }),
    price: z.number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    }),
    tags: z.array(z.string({
        required_error: 'Tags are required',
        invalid_type_error: 'Each tags must be a string (path)',
      })),
    stock: z.number({
      required_error: 'Stock is required',
      invalid_type_error: 'Stock must be an integer',
    }).int(),
    discount: z.number({
      required_error: 'Discount is required',
      invalid_type_error: 'Discount must be a number',
    }),
    weight: z.number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a number',
    }),
   
  }),
});
