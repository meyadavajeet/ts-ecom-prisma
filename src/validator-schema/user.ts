import { z } from "zod";
export const SignupSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(5).max(20),
});


export const LoginSchema = z.object({
  email : z.string().email(),
  password : z.string().min(5).max(20)
})

export const AddressSchema = z.object({
  lineOne : z.string().min(1).max(50),
  lineTwo : z.string().optional(),
  city : z.string().min(1).max(50),
  state : z.string().min(1).max(50),
  country : z.string().min(1).max(50),
  pinCode : z.string().min(6).max(6)
});

export const UpdateUserSchema = z.object({
  name : z.string().optional(),
  shippingAddress : z.number().optional(),
  defaultAddress : z.number().optional()
})