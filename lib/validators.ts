import z from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places",
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  categoryId: z.string().min(1, "Category is required"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  images: z.array(z.string()).min(1, "Product must have atleast one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for  sign in user
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for sign up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for cart
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  qty: z.number().int().min(1, "Quantity must be at least 1"),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name is required"),
  streetAddress: z.string().min(3, "Address is required"),
  apartment: z.string().optional(),
  barangay: z.string().min(1, "Barangay is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
