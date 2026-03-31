import * as productRepo from "./product.repository.js";
import { getCategoryById } from "../category/category.repository.js";

export const listProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    productRepo.getAllProducts(skip, limit),
    productRepo.countProducts()
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getProduct = async (id) => {
  const product = await productRepo.getProductById(id);
  if (!product) throw { status: 404, message: "Product not found." };
  return product;
};

export const addProduct = async (data) => {
  // Verify category exists
  const category = await getCategoryById(data.category_id);
  if (!category) throw { status: 400, message: "Invalid category ID." };

  return await productRepo.createProduct(data);
};

export const editProduct = async (id, data) => {
  if (data.category_id) {
    const category = await getCategoryById(data.category_id);
    if (!category) throw { status: 400, message: "Invalid category ID." };
  }

  try {
    return await productRepo.updateProduct(id, data);
  } catch (error) {
    throw { status: 404, message: "Product not found or update failed." };
  }
};

export const removeProduct = async (id) => {
  try {
    return await productRepo.deleteProduct(id);
  } catch (error) {
    throw { status: 404, message: "Product not found or deletion failed." };
  }
};

export const updateProductStatus = async (id, status) => {
  try {
    return await productRepo.updateProduct(id, { status });
  } catch (error) {
    throw { status: 404, message: "Product not found." };
  }
};

export const adjustStock = async ({ productId, quantityChange, userId, movementType, note }) => {
  const product = await productRepo.getProductById(productId);
  if (!product) throw { status: 404, message: "Product not found." };

  const previousStock = product.stock_quantity;
  const newStock = previousStock + quantityChange;

  if (newStock < 0) {
    throw { status: 400, message: "Insufficient stock for this operation." };
  }

  const [updatedProduct] = await productRepo.updateStockWithMovement({
    productId,
    quantityChange,
    newStock,
    previousStock,
    userId,
    movementType,
    note
  });

  return updatedProduct;
};
