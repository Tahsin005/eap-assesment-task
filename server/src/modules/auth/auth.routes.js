import { Router } from "express";
import { signupHandler, loginHandler, meHandler, logoutHandler } from "./auth.handler.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

// POST /api/v1/auth/signup
router.post("/signup", signupHandler);

// POST /api/v1/auth/login
router.post("/login", loginHandler);

// GET /api/v1/auth/me
router.get("/me", authenticate, meHandler);

// POST /api/v1/auth/logout
router.post("/logout", authenticate, logoutHandler);

export default router;

