import { Router } from "express";
import {
  getAllUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  changeRoleHandler,
  changeStatusHandler,
} from "./user.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// all routes are admin-only
router.use(authenticate, authorise("ADMIN"));

router.get("/", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.post("/", createUserHandler);
router.patch("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);
router.patch("/:id/role", changeRoleHandler);
router.patch("/:id/status", changeStatusHandler);

export default router;
