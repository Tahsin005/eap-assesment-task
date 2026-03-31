import prisma from "../../lib/prisma.js";

export const getQueue = async () => {
  return prisma.restockQueue.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          stock_quantity: true,
          minimum_stock_threshold: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const getQueueItemById = async (id) => {
  return prisma.restockQueue.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          stock_quantity: true,
          minimum_stock_threshold: true
        }
      }
    }
  });
};

export const addToQueue = async (data) => {
  return prisma.restockQueue.create({
    data,
    include: {
      product: {
        select: { name: true }
      }
    }
  });
};

export const updatePriority = async (id, priority) => {
  return prisma.restockQueue.update({
    where: { id },
    data: { priority },
    include: {
      product: {
        select: { name: true }
      }
    }
  });
};

export const removeFromQueue = async (id) => {
  return prisma.restockQueue.delete({
    where: { id },
    include: {
      product: {
        select: { name: true }
      }
    }
  });
};
