"use server";

import { prisma } from "@/db/prisma";

const LOW_STOCK_THRESHOLD = 10;

export async function getDashboardStats() {
  const [
    revenueResult,
    totalOrders,
    totalProducts,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { totalPrice: true },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count({ where: { isDelivered: false } }),
    prisma.product.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: "asc" },
      select: { id: true, name: true, slug: true, stock: true },
      take: 10,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
  ]);

  return {
    totalRevenue: revenueResult._sum.totalPrice?.toString() ?? "0",
    totalOrders,
    totalProducts,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  };
}
