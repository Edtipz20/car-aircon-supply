"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { reviewFormSchema, ReviewFormValues } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function canUserReviewProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: session.user.id },
    },
  });

  return !!orderItem;
}

export async function getUserReviewForProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.review.findUnique({
    where: {
      userId_productId: { userId: session.user.id, productId },
    },
  });
}

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrUpdateReview(
  data: ReviewFormValues,
  productSlug: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be signed in to leave a review",
      };
    }

    const parsed = reviewFormSchema.parse(data);

    const eligible = await canUserReviewProduct(parsed.productId);
    if (!eligible) {
      return {
        success: false,
        message: "Only customers who purchased this product can leave a review",
      };
    }

    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: parsed.productId,
        },
      },
      update: {
        rating: parsed.rating,
        title: parsed.title,
        description: parsed.description,
      },
      create: {
        userId: session.user.id,
        productId: parsed.productId,
        rating: parsed.rating,
        title: parsed.title,
        description: parsed.description,
        isVerifiedPurchase: true,
      },
    });

    // Recalculate the product's aggregate rating from every review, not
    // just this one — keeps it accurate as reviews get added or edited.
    const agg = await prisma.review.aggregate({
      where: { productId: parsed.productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: parsed.productId },
      data: {
        rating: (agg._avg.rating ?? 0).toFixed(2),
        numReviews: agg._count,
      },
    });

    revalidatePath(`/product/${productSlug}`);
    return { success: true, message: "Review submitted" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Please check your review",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}
