import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be non-negative").optional(),
  currency: z.string().optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  features: z.array(z.string()).optional(),
  specification: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  metadata: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .optional(),
  product_type: z.enum(["variant", "product"]),
  parent_id: z.string().optional(),
  s3_key: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial().omit({
  product_type: true,
  parent_id: true,
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
