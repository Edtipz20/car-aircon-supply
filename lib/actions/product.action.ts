"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { Prisma } from "@/generated/prisma/client";
import { categorySchema, insertProductSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { ZodError, type z } from "zod";

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

// Search query
export async function getAllProducts({
  query,
  category,
  brand,
  sort,
  page = 1,
  limit = 12,
}: {
  query?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.ProductWhereInput = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(brand ? { brand } : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" }; // default: newest first

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount,
  };
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getAllBrands() {
  const brands = await prisma.product.findMany({
    distinct: ["brand"],
    select: { brand: true },
    orderBy: { brand: "asc" },
  });
  return brands.map((b) => b.brand);
}

export async function getAllProductsAdmin({
  query,
  page = 1,
  limit = 10,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.ProductWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount,
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const parsed = insertProductSchema.parse(data);

    const existingSlug = await prisma.product.findUnique({
      where: { slug: parsed.slug },
    });
    if (existingSlug) {
      return {
        success: false,
        message: "A product with this slug already exists",
      };
    }

    await prisma.product.create({ data: parsed });

    revalidatePath("/admin/products");
    return { success: true, message: "Product created" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Invalid input",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof insertProductSchema>,
) {
  try {
    const parsed = insertProductSchema.parse(data);

    const existingSlug = await prisma.product.findFirst({
      where: { slug: parsed.slug, NOT: { id } },
    });
    if (existingSlug) {
      return {
        success: false,
        message: "A product with this slug already exists",
      };
    }

    await prisma.product.update({ where: { id }, data: parsed });

    revalidatePath("/admin/products");
    revalidatePath(`/product/${parsed.slug}`);
    return { success: true, message: "Product updated" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Invalid input",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted" };
  } catch {
    return {
      success: false,
      message:
        "Could not delete — this product may have existing orders or reviews",
    };
  }
}

// Category
export async function getAllCategoriesAdmin() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(data: { name: string; slug: string }) {
  try {
    const parsed = categorySchema.parse(data);

    const existingSlug = await prisma.category.findUnique({
      where: { slug: parsed.slug },
    });
    if (existingSlug) {
      return {
        success: false,
        message: "A category with this slug already exists",
      };
    }

    await prisma.category.create({ data: parsed });
    revalidatePath("/admin/categories");
    return { success: true, message: "Category created" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Invalid input",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateCategory(
  id: string,
  data: { name: string; slug: string },
) {
  try {
    const parsed = categorySchema.parse(data);

    const existingSlug = await prisma.category.findFirst({
      where: { slug: parsed.slug, NOT: { id } },
    });
    if (existingSlug) {
      return {
        success: false,
        message: "A category with this slug already exists",
      };
    }

    await prisma.category.update({ where: { id }, data: parsed });
    revalidatePath("/admin/categories");
    return { success: true, message: "Category updated" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Invalid input",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted" };
  } catch {
    return {
      success: false,
      message:
        "Could not delete — this category still has products assigned to it",
    };
  }
}
