import * as authService from "./auth.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return sendError(res, "username, email and password are required.", 400);
    }

    const user = await authService.signup({ username, email, password, role });

    return sendSuccess(res, "Account created successfully.", user, 201);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "email and password are required.", 400);
    }

    const result = await authService.login({ email, password });

    return sendSuccess(res, "Logged in successfully.", result, 200);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

