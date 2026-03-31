import { Router } from "express";
import { signupHandler, loginHandler } from "./auth.handler.js";

const router = Router();

// POST /api/v1/auth/signup
router.post("/signup", signupHandler);

// POST /api/v1/auth/login
router.post("/login", loginHandler);

export default router;
