import { z } from "zod";
export const ProductSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(100),
  price: z.number().min(0),
  tags: z.array(z.string()).optional(),
});