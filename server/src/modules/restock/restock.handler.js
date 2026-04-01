import * as restockService from "./restock.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const getQueueHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await restockService.listQueue(page, limit);
    return sendSuccess(res, "Restock queue fetched successfully.", result.queue, 200, result.meta);
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

export const deleteFromQueueHandler = async (req, res) => {
  try {
    const item = await restockService.deleteQueueItem(req.params.id);
    
    logActivity(`${req.user.role} (${req.user.username}) removed "${item.product.name}" from Restock Queue.`);

    return sendSuccess(res, "Item removed from restock queue successfully.");
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};
