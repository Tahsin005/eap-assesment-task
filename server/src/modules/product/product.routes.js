import { Router } from "express";
import {
  getAllProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  updateStatusHandler,
  adjustStockHandler,
} from "./product.handler.js";
import { getProductMovementsHandler } from "../stock/stock.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";


const router = Router();

// accessible by Admin and Manager
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);
router.get("/:id/stock-movements", getProductMovementsHandler);
router.post("/", createProductHandler);

router.patch("/:id", updateProductHandler);
router.patch("/:id/status", updateStatusHandler);
router.patch("/:id/stock", adjustStockHandler);

// ADMIN only
router.delete("/:id", authorise("ADMIN"), deleteProductHandler);

export default router;
