import prisma from "../../lib/prisma.js";

export const getAllMovements = async (skip = 0, take = 10, where = {}) => {
  return prisma.stockMovement.findMany({
    skip,
    take,
    where,
    include: {
      product: {
        select: { id: true, name: true }
      },
      user: {
        select: { id: true, username: true }
      },
      order: {
        select: { id: true, customer_name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const countMovements = async (where = {}) => {
  return prisma.stockMovement.count({ where });
};

export const getMovementById = async (id) => {
  return prisma.stockMovement.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true }
      },
      user: {
        select: { id: true, username: true }
      },
      order: {
        select: { id: true, customer_name: true }
      }
    }
  });
};
