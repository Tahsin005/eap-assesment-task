import { Router } from "express";
import {
  getQueueHandler,
  getQueueItemHandler,
  deleteFromQueueHandler,
} from "./restock.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// accessible by Admin and Manager
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/", getQueueHandler);
router.get("/:id", getQueueItemHandler);
router.delete("/:id", deleteFromQueueHandler);

export default router;
