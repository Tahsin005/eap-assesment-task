import { Router } from "express";
import {
  getSummaryHandler,
  getOrdersTodayHandler,
  getRevenueTodayHandler,
  getLowStockCountHandler,
  getPendingVsCompletedHandler
} from "./dashboard.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// accessible by Admin and Manager
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/summary", getSummaryHandler);
router.get("/orders-today", getOrdersTodayHandler);
router.get("/revenue-today", getRevenueTodayHandler);
router.get("/low-stock-count", getLowStockCountHandler);
router.get("/pending-vs-completed", getPendingVsCompletedHandler);

export default router;
