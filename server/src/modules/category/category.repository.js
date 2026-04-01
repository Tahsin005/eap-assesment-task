import prisma from "../../lib/prisma.js";
import { handlePrismaError } from "../../utils/prismaErrors.js";

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
  try {
    return await prisma.category.create({
      data,
      include: {
        creator: {
          select: { id: true, username: true, role: true }
        }
      }
    });
  } catch (error) {
    handlePrismaError(error, "Category");
  }
};

export const updateCategory = async (id, data) => {
  try {
    return await prisma.category.update({
      where: { id },
      data,
      include: {
        creator: {
          select: { id: true, username: true, role: true }
        }
      }
    });
  } catch (error) {
    handlePrismaError(error, "Category");
  }
};

export const deleteCategory = async (id) => {
  try {
    return await prisma.category.delete({
      where: { id }
    });
  } catch (error) {
    handlePrismaError(error, "Category");
  }
};
