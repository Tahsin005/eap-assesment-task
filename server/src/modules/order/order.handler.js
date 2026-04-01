import * as orderService from "./order.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const getAllOrdersHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await orderService.listOrders(page, limit);
    return sendSuccess(res, "Orders fetched successfully.", result.orders, 200, result.meta);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getOrderByIdHandler = async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    return sendSuccess(res, "Order details fetched successfully.", order);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const createOrderHandler = async (req, res) => {
  try {
    const { customer_name, items } = req.body;
    const order = await orderService.placeOrder({ customer_name, items }, req.user.id);
    
    logActivity(`${req.user.role} (${req.user.username}) created order for "${customer_name}" (ID: ${order.id}).`);
    
    return sendSuccess(res, "Order created successfully.", order, 201);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updateOrderHandler = async (req, res) => {
  try {
    const order = await orderService.updateOrderInfo(req.params.id, req.body);
    logActivity(`${req.user.role} (${req.user.username}) updated order ID ${req.params.id}.`);
    return sendSuccess(res, "Order updated successfully.", order);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const deleteOrderHandler = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id, req.user.id);

    logActivity(`${req.user.role} (${req.user.username}) deleted order ID ${req.params.id}.`);
    return sendSuccess(res, "Order deleted successfully.");
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.setOrderStatus(req.params.id, status);
    logActivity(`${req.user.role} (${req.user.username}) updated status of order ${order.id} to ${status}.`);
    return sendSuccess(res, "Order status updated successfully.", order);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const cancelOrderHandler = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    logActivity(`${req.user.role} (${req.user.username}) cancelled order ${order.id} and returned stock.`);
    return sendSuccess(res, "Order cancelled and stock returned successfully.", order);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

