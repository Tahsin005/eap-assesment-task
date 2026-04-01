import prisma from "../../lib/prisma.js";
import { handlePrismaError } from "../../utils/prismaErrors.js";

export const getAllUsers = async (skip = 0, take = 10) => {
  return prisma.user.findMany({
    skip,
    take,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      is_active: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const countUsers = async () => {
  return prisma.user.count();
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      is_active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createUser = async (data) => {
  try {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        createdAt: true,
      },
    });
  } catch (error) {
    handlePrismaError(error, "User");
  }
};

export const updateUser = async (id, data) => {
  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    handlePrismaError(error, "User");
  }
};

export const deleteUser = async (id) => {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    handlePrismaError(error, "User");
  }
};
