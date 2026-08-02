"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { cartItemSchema } from "@/lib/validators";
import { z } from "zod";
import { convertToPlainObject } from "../utils";

// Postgres Decimal columns are safest handled as strings server-side;
// this keeps two-decimal precision without floating point drift.
function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calcPrice(items: { price: string; qty: number }[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

export async function getMyCart() {
  const cookieStore = await cookies();
  const sessionCartId = cookieStore.get("sessionCartId")?.value;
  const session = await auth();
  const userId = session?.user?.id;

  if (!sessionCartId && !userId) return undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.images[0],
      price: item.price,
      qty: item.qty,
      stock: item.product.stock,
    })),
  });
}

export async function addItemToCart(data: z.infer<typeof cartItemSchema>) {
  try {
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    const session = await auth();
    const userId = session?.user?.id;

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
      include: { items: true },
    });

    // No cart yet — create one with this as the first item
    if (!cart) {
      if (product.stock < item.qty) {
        return { success: false, message: "Not enough stock" };
      }

      const prices = calcPrice([
        { price: product.price.toString(), qty: item.qty },
      ]);

      cart = await prisma.cart.create({
        data: {
          userId,
          sessionCartId,
          ...prices,
        },
        include: { items: true },
      });

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          qty: item.qty,
          price: product.price,
        },
      });

      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    }

    // Cart exists — check if this product's already in it
    const existingItem = cart.items.find((x) => x.productId === item.productId);
    const newQty = (existingItem?.qty ?? 0) + item.qty;

    if (product.stock < newQty) {
      return { success: false, message: "Not enough stock" };
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId: item.productId },
      },
      update: { qty: newQty },
      create: {
        cartId: cart.id,
        productId: item.productId,
        qty: item.qty,
        price: product.price,
      },
    });

    // Recalculate totals across the full updated cart
    const updatedItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });
    const prices = calcPrice(
      updatedItems.map((i) => ({ price: i.price.toString(), qty: i.qty })),
    );

    await prisma.cart.update({
      where: { id: cart.id },
      data: prices,
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: existingItem
        ? `Quantity updated`
        : `${product.name} added to cart`,
    };
  } catch {
    return { success: false, message: "Something went wrong adding to cart" };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get("sessionCartId")?.value;
    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
      include: { items: true },
    });

    if (!cart) return { success: false, message: "Cart not found" };

    const existingItem = cart.items.find((x) => x.productId === productId);
    if (!existingItem) return { success: false, message: "Item not in cart" };

    if (existingItem.qty === 1) {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
    } else {
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { qty: existingItem.qty - 1 },
      });
    }

    const updatedItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });
    const prices = calcPrice(
      updatedItems.map((i) => ({ price: i.price.toString(), qty: i.qty })),
    );

    await prisma.cart.update({ where: { id: cart.id }, data: prices });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product) revalidatePath(`/product/${product.slug}`);

    return { success: true, message: "Item removed from cart" };
  } catch {
    return { success: false, message: "Something went wrong removing item" };
  }
}

export async function clearCart() {
  try {
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get("sessionCartId")?.value;
    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) return { success: false, message: "Cart not found" };

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        itemsPrice: "0",
        shippingPrice: "0",
        taxPrice: "0",
        totalPrice: "0",
      },
    });

    revalidatePath("/cart");
    return { success: true, message: "Cart cleared" };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
