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
  return await productRepo.updateProduct(id, data);
};

export const removeProduct = async (id) => {
  return await productRepo.deleteProduct(id);
};

export const updateProductStatus = async (id, status) => {
  return await productRepo.updateProduct(id, { status });
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
