import { Router } from "express";
import {
  getAllOrdersHandler,
  getOrderByIdHandler,
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
  updateStatusHandler,
  cancelOrderHandler,
  addItemHandler,
  updateItemHandler,
  deleteItemHandler,
} from "./order.handler.js";
import { getOrderMovementsHandler } from "../stock/stock.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// accessible by Admin and Manager
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/", getAllOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.get("/:id/stock-movements", getOrderMovementsHandler);
router.post("/", createOrderHandler);
router.patch("/:id", updateOrderHandler);
router.patch("/:id/status", updateStatusHandler);
router.patch("/:id/cancel", cancelOrderHandler);

// Order Items
router.post("/:id/items", addItemHandler);
router.patch("/:id/items/:itemId", updateItemHandler);
router.delete("/:id/items/:itemId", deleteItemHandler);

// ADMIN only
router.delete("/:id", authorise("ADMIN"), deleteOrderHandler);

export default router;
