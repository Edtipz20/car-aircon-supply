import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";

// Get latest products
export async function getLatestProducts() {
  try {
    const data = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    return convertToPlainObject(data);
  } catch (error) {
    console.error("Error fetching latest products", error);
    return [];
  }
}

// Get product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
