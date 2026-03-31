import prisma from "../../lib/prisma.js";

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
  return prisma.user.create({
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
};

export const updateUser = async (id, data) => {
  return prisma.user.update({
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
};

export const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};
