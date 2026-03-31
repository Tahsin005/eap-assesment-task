import prisma from "../../lib/prisma.js";

/**
 * Fetch the latest N activity logs.
 */
export const getRecentActivities = async (limit = 10) => {
  return prisma.activity.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};
