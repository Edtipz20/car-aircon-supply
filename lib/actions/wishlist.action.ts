"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { convertToPlainObject } from "../utils";

export async function toggleWishlistItem(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Please sign in to save items",
        inWishlist: false,
      };
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      revalidatePath("/", "layout");
      return {
        success: true,
        message: "Removed from wishlist",
        inWishlist: false,
      };
    }

    await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });
    revalidatePath("/", "layout");
    return { success: true, message: "Added to wishlist", inWishlist: true };
  } catch (error) {
    console.error("Wishlist toggle failed:", error);
    return {
      success: false,
      message: "Something went wrong",
      inWishlist: false,
    };
  }
}

export async function getWishlistProductIds(): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user?.id) return new Set();

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });

  return new Set(items.map((i) => i.productId));
}

export async function getMyWishlist() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(items.map((item) => item.product));
}
