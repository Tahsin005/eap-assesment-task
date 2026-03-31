import * as dashboardService from "./dashboard.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const getSummaryHandler = async (req, res) => {
  try {
    const data = await dashboardService.fetchSummary();
    return sendSuccess(res, "Dashboard summary fetched successfully.", data);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", 500);
  }
};

export const getOrdersTodayHandler = async (req, res) => {
  try {
    const data = await dashboardService.fetchDailyMetrics();
    return sendSuccess(res, "Orders created today fetched successfully.", { count: data.ordersToday });
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", 500);
  }
};

export const getRevenueTodayHandler = async (req, res) => {
  try {
    const data = await dashboardService.fetchDailyMetrics();
    return sendSuccess(res, "Revenue generated today fetched successfully.", { revenue: data.revenueToday });
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", 500);
  }
};

export const getLowStockCountHandler = async (req, res) => {
  try {
    const data = await dashboardService.fetchLowStockCount();
    return sendSuccess(res, "Low stock product count fetched successfully.", data);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", 500);
  }
};

export const getPendingVsCompletedHandler = async (req, res) => {
  try {
    const data = await dashboardService.fetchOrderDistribution();
    return sendSuccess(res, "Order status distribution fetched successfully.", data);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", 500);
  }
};
