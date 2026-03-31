import { Router } from "express";
import { getActivitiesHandler } from "./activity.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// GET /api/v1/activities
router.get("/", authenticate, authorise("ADMIN"), getActivitiesHandler);

export default router;
