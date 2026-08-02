"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getMyCart } from "@/lib/actions/cart.action";
import { revalidatePath } from "next/cache";

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

export async function getMyOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });

  return orders;
}
