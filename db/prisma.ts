import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaNeon({ connectionString });

function createExtendedPrismaClient() {
  const basePrisma = new PrismaClient({ adapter });

  return basePrisma.$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product: { price: { toString(): string } | null }) {
            return product.price ? product.price.toString() : "0";
          },
        },
        rating: {
          needs: { rating: true },
          compute(product: { rating: { toString(): string } | null }) {
            return product.rating ? product.rating.toString() : "0";
          },
        },
      },
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(order) {
            return order.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(order) {
            return order.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(order) {
            return order.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(order) {
            return order.totalPrice.toString();
          },
        },
      },
      orderItem: {
        price: {
          needs: { price: true },
          compute(orderItem) {
            return orderItem.price.toString();
          },
        },
      },
      cartItem: {
        price: {
          needs: { price: true },
          compute(cartItem) {
            return cartItem.price.toString();
          },
        },
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

// Prevent hot-reload in dev from spawning a new PrismaClient on every save
const globalForPrisma = globalThis as unknown as {
  prisma?: ExtendedPrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createExtendedPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
