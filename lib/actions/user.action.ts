"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  ShippingAddress,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts";
import { ZodError } from "zod";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const callbackUrl = (formData.get("callbackUrl") as string) || "/";
    await signIn("credentials", { ...user, redirectTo: callbackUrl });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const parsed = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const existingUser = await prisma.user.findFirst({
      where: { email: parsed.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashSync(parsed.password, 10),
      },
    });

    // Sign them in immediately after registering
    await signIn("credentials", {
      email: parsed.email,
      password: parsed.password,
      redirect: false,
    });

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        message: "Please check your inputs and try again",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "You must be signed in" };
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { address },
    });

    return { success: true, message: "Address saved" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Invalid address",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}
