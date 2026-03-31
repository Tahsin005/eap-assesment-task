import * as productService from "./product.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const getAllProductsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await productService.listProducts(page, limit);
    return sendSuccess(res, "Products fetched successfully.", result.products, 200, result.meta);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getProductByIdHandler = async (req, res) => {
  try {
    const product = await productService.getProduct(req.params.id);
    return sendSuccess(res, "Product fetched successfully.", product);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const createProductHandler = async (req, res) => {
  try {
    const { name, category_id, price, stock_quantity, minimum_stock_threshold } = req.body;
    
    if (!name || !category_id || price === undefined || stock_quantity === undefined) {
      return sendError(res, "name, category_id, price and stock_quantity are required.", 400);
    }

    const product = await productService.addProduct({
      name,
      category_id,
      price: parseFloat(price),
      stock_quantity: parseInt(stock_quantity),
      minimum_stock_threshold: parseInt(minimum_stock_threshold) || 0,
      created_by: req.user.id
    });

    logActivity(`${req.user.role} (${req.user.username}) created product "${name}".`);

    return sendSuccess(res, "Product created successfully.", product, 201);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const product = await productService.editProduct(req.params.id, req.body);
    
    logActivity(`${req.user.role} (${req.user.username}) updated product "${product.name}".`);

    return sendSuccess(res, "Product updated successfully.", product);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    const product = await productService.removeProduct(req.params.id);
    
    logActivity(`Admin (${req.user.username}) deleted product "${product.name}".`);

    return sendSuccess(res, "Product deleted successfully.");
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, "Status is required.", 400);

    const product = await productService.updateProductStatus(req.params.id, status);
    
    logActivity(`${req.user.role} (${req.user.username}) updated status of "${product.name}" to ${status}.`);

    return sendSuccess(res, "Product status updated successfully.", product);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const adjustStockHandler = async (req, res) => {
  try {
    const { quantity_change, movement_type, note } = req.body;
    
    if (quantity_change === undefined || !movement_type) {
      return sendError(res, "quantity_change and movement_type are required.", 400);
    }

    const product = await productService.adjustStock({
      productId: req.params.id,
      quantityChange: parseInt(quantity_change),
      userId: req.user.id,
      movementType: movement_type,
      note
    });

    logActivity(`${req.user.role} (${req.user.username}) adjusted stock for "${product.name}" (${quantity_change}).`);

    return sendSuccess(res, "Stock adjusted successfully.", product);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};
