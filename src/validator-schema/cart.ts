import z from "zod";

export const CreateCartSchema = z.object({
  productId: z.number().min(1),
  quantity: z.number().min(1),
});

export const UpdateCartQuanity = z.object({
  quantity : z.number().min(1)
})