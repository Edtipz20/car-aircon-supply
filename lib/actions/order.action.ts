"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getMyCart } from "@/lib/actions/cart.action";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@/generated/prisma/client";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "You must be signed in" };
    }

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Your cart is empty" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.address) {
      return { success: false, message: "No shipping address on file" };
    }

    if (!user.paymentMethod) {
      return { success: false, message: "No payment method selected" };
    }

    const paymentMethod = user.paymentMethod;

    const orderId = await prisma.$transaction(async (tx) => {
      // Re-check stock atomically inside the transaction — the cart's
      // stock snapshot could be stale if someone else bought the last
      // unit between adding to cart and placing this order.
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`${item.name} is no longer available`);
        }
        if (product.stock < item.qty) {
          throw new Error(`Not enough stock for ${item.name}`);
        }
      }

      const order = await tx.order.create({
        data: {
          userId: user.id,
          shippingAddress: user.address as never,
          paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
      });

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            qty: item.qty,
            price: item.price,
            name: item.name,
            slug: item.slug,
            image: item.image,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }

      // Clear the cart now that everything's been converted into an order
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          itemsPrice: "0",
          shippingPrice: "0",
          taxPrice: "0",
          totalPrice: "0",
        },
      });

      return order.id;
    });

    revalidatePath("/", "layout");

    return { success: true, message: "Order placed", orderId };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return order;
}

export async function getMyOrders({
  page,
  limit = PAGE_SIZE,
}: {
  page: number;
  limit?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const data = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session.user.id },
  });

  return { data, totalPages: Math.ceil(dataCount / limit) };
}

const ORDERS_PER_PAGE = PAGE_SIZE;

export async function getMyOrdersPaginated(page = 1) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * ORDERS_PER_PAGE;

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: ORDERS_PER_PAGE,
    }),
    prisma.order.count({
      where: { userId: session.user.id },
    }),
  ]);

  return {
    orders,
    totalPages: Math.max(1, Math.ceil(totalOrders / ORDERS_PER_PAGE)),
    currentPage: safePage,
  };
}

// Get all orders
export async function getAllOrdersAdmin({
  page = 1,
  limit = 3,
  paid,
  delivered,
  dateRange,
}: {
  page?: number;
  limit?: number;
  paid?: string;
  delivered?: string;
  dateRange?: string;
}) {
  const where: Prisma.OrderWhereInput = {
    ...(paid === "true" ? { isPaid: true } : {}),
    ...(paid === "false" ? { isPaid: false } : {}),
    ...(delivered === "true" ? { isDelivered: true } : {}),
    ...(delivered === "false" ? { isDelivered: false } : {}),
    ...(dateRange ? { createdAt: { gte: getDateRangeStart(dateRange) } } : {}),
  };

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount,
  };
}

function getDateRangeStart(range: string): Date {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(0); // all time
  }
}

export async function markOrderAsPaid(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date() },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order marked as paid" };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function markOrderAsDelivered(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order marked as delivered" };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
