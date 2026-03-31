import prisma from "../../lib/prisma.js";

export const getSummaryStats = async () => {
  const [users, products, categories, orders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count()
  ]);

  return { users, products, categories, orders };
};

export const getDailyStats = async (startOfDay, endOfDay) => {
  const [ordersToday, revenueToday] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }),
    prisma.order.aggregate({
      _sum: { total_price: true },
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { not: "cancelled" }
      }
    })
  ]);

  return {
    ordersToday,
    revenueToday: revenueToday._sum.total_price || 0
  };
};

export const getLowStockCount = async () => {
  const result = await prisma.$queryRaw`
    SELECT COUNT(*)::int as count 
    FROM "Product" 
    WHERE "stock_quantity" <= "minimum_stock_threshold"
  `;
  return result[0].count;
};

export const getOrderStatusDistribution = async () => {
  const stats = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      _all: true
    }
  });

  return stats.map(s => ({
    status: s.status,
    count: s._count._all
  }));
};
