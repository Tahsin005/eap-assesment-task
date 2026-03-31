import prisma from "../../lib/prisma.js";

export const getAllProducts = async (skip = 0, take = 10) => {
  return prisma.product.findMany({
    skip,
    take,
    include: {
      category: {
        select: { id: true, name: true }
      },
      creator: {
        select: { id: true, username: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const countProducts = async () => {
  return prisma.product.count();
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true }
      },
      creator: {
        select: { id: true, username: true }
      }
    }
  });
};


export const createProduct = async (data) => {
  return prisma.product.create({
    data,
    include: {
      category: {
        select: { id: true, name: true }
      }
    }
  });
};

export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: {
        select: { id: true, name: true }
      }
    }
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id }
  });
};

// atomic stock update with movement logging.
export const updateStockWithMovement = async ({ 
  productId, 
  quantityChange, 
  newStock, 
  previousStock, 
  userId, 
  movementType, 
  note 
}) => {
  return prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock_quantity: newStock }
    }),
    prisma.stockMovement.create({
      data: {
        product_id: productId,
        user_id: userId,
        movement_type: movementType,
        quantity_change: quantityChange,
        previous_stock: previousStock,
        new_stock: newStock,
        note
      }
    })
  ]);
};
