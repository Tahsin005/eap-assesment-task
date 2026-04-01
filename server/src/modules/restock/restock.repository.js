import prisma from "../../lib/prisma.js";
import { handlePrismaError } from "../../utils/prismaErrors.js";

export const getQueue = async (skip = 0, take = 10) => {
  return prisma.restockQueue.findMany({
    skip,
    take,
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
    orderBy: {
      product: {
        stock_quantity: "asc"
      }
    }
  });
};

export const countQueue = async () => {
  return prisma.restockQueue.count();
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
  try {
    return await prisma.restockQueue.create({
      data,
      include: {
        product: {
          select: { name: true }
        }
      }
    });
  } catch (error) {
    handlePrismaError(error, "Restock queue item");
  }
};

export const updatePriority = async (id, priority) => {
  try {
    return await prisma.restockQueue.update({
      where: { id },
      data: { priority },
      include: {
        product: {
          select: { name: true }
        }
      }
    });
  } catch (error) {
    handlePrismaError(error, "Restock queue priority");
  }
};

export const removeFromQueue = async (id) => {
  try {
    return await prisma.restockQueue.delete({
      where: { id },
      include: {
        product: {
          select: { name: true }
        }
      }
    });
  } catch (error) {
    handlePrismaError(error, "Restock queue item deletion");
  }
};
