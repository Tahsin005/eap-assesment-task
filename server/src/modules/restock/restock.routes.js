import { Router } from "express";
import {
  getQueueHandler,
  getQueueItemHandler,
  addToQueueHandler,
  updatePriorityHandler,
  deleteFromQueueHandler,
} from "./restock.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// accessible by Admin and Manager
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/", getQueueHandler);
router.get("/:id", getQueueItemHandler);
router.post("/", addToQueueHandler);
router.patch("/:id", updatePriorityHandler);
router.delete("/:id", deleteFromQueueHandler);

export default router;
