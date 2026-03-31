import * as stockService from "./stock.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const getAllMovementsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await stockService.listMovements(page, limit);
    return sendSuccess(res, "Stock movements fetched successfully.", result.movements, 200, result.meta);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getMovementByIdHandler = async (req, res) => {
  try {
    const movement = await stockService.getMovement(req.params.id);
    return sendSuccess(res, "Stock movement fetched successfully.", movement);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getProductMovementsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const productId = req.params.id;
    
    const result = await stockService.listMovements(page, limit, { product_id: productId });
    return sendSuccess(res, `Stock movements for product ${productId} fetched successfully.`, result.movements, 200, result.meta);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getOrderMovementsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderId = req.params.id;
    
    const result = await stockService.listMovements(page, limit, { order_id: orderId });
    return sendSuccess(res, `Stock movements for order ${orderId} fetched successfully.`, result.movements, 200, result.meta);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};
