import prisma from "../../lib/prisma.js";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      creator: {
        select: { id: true, username: true, role: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, username: true, role: true }
      }
    }
  });
};

export const findCategoryByName = async (name) => {
  return prisma.category.findUnique({ where: { name } });
};

export const createCategory = async (data) => {
  return prisma.category.create({
    data,
    include: {
      creator: {
        select: { id: true, username: true, role: true }
      }
    }
  });
};

export const updateCategory = async (id, data) => {
  return prisma.category.update({
    where: { id },
    data,
    include: {
      creator: {
        select: { id: true, username: true, role: true }
      }
    }
  });
};

export const deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id }
  });
};
