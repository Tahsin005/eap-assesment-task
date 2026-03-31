import { Router } from "express";
import {
  getAllMovementsHandler,
  getMovementByIdHandler,
} from "./stock.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// accessible by Admin and Manager
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/", getAllMovementsHandler);
router.get("/:id", getMovementByIdHandler);

export default router;
