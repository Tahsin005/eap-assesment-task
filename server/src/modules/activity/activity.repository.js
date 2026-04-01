import prisma from "../../lib/prisma.js";

export const getRecentActivities = async (skip = 0, take = 10) => {
  return prisma.activity.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
};

export const countActivities = async () => {
  return prisma.activity.count();
};
