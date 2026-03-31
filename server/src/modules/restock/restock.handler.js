import * as restockService from "./restock.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const getQueueHandler = async (req, res) => {
  try {
    const queue = await restockService.listQueue();
    return sendSuccess(res, "Restock queue fetched successfully.", queue);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getQueueItemHandler = async (req, res) => {
  try {
    const item = await restockService.getQueueItem(req.params.id);
    return sendSuccess(res, "Restock item fetched successfully.", item);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const addToQueueHandler = async (req, res) => {
  try {
    const { product_id, priority } = req.body;
    if (!product_id) return sendError(res, "product_id is required.", 400);

    const item = await restockService.addRestockItem({ product_id, priority });
    
    logActivity(`${req.user.role} (${req.user.username}) added "${item.product.name}" to Restock Queue.`);

    return sendSuccess(res, "Product added to restock queue successfully.", item, 201);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updatePriorityHandler = async (req, res) => {
  try {
    const { priority } = req.body;
    if (!priority) return sendError(res, "priority is required.", 400);

    const item = await restockService.editPriority(req.params.id, priority);
    
    logActivity(`${req.user.role} (${req.user.username}) updated priority of "${item.product.name}" in Restock Queue.`);

    return sendSuccess(res, "Restock priority updated successfully.", item);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const deleteFromQueueHandler = async (req, res) => {
  try {
    const item = await restockService.deleteQueueItem(req.params.id);
    
    logActivity(`${req.user.role} (${req.user.username}) removed "${item.product.name}" from Restock Queue.`);

    return sendSuccess(res, "Item removed from restock queue successfully.");
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};
