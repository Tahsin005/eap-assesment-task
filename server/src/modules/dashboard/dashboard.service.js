import * as dashboardRepo from "./dashboard.repository.js";

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

export const fetchSummary = async () => {
  return dashboardRepo.getSummaryStats();
};

export const fetchDailyMetrics = async () => {
  const { start, end } = getTodayRange();
  return dashboardRepo.getDailyStats(start, end);
};

export const fetchLowStockCount = async () => {
  const count = await dashboardRepo.getLowStockCount();
  return { count };
};

export const fetchOrderDistribution = async () => {
  const distribution = await dashboardRepo.getOrderStatusDistribution();
  // Ensure we group or format if needed, but repository returns a clean array
  return distribution;
};
