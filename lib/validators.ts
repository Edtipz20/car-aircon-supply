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
  email: z.email("Invalid email address"),
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

export const paymentMethodSchema = z.object({
  type: z.literal("CashOnDelivery"),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name is required"),
  mobileNumber: z
    .string()
    .min(10, "Enter a valid mobile number")
    .regex(/^(09|\+639)\d{9}$/, "Enter a valid PH mobile number"),
  streetAddress: z.string().min(3, "Address is required"),
  apartment: z.string().optional(),
  barangay: z.string().min(1, "Barangay is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Schema to update user's profile
export const updateProfileSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    confirmNewPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmNewPassword,
    { message: "Passwords do not match", path: ["confirmNewPassword"] },
  );

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Schema for Reviews
export const reviewFormSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Review must be at least 10 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

// Schema for category
export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
