import * as authService from "./auth.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return sendError(res, "username, email and password are required.", 400);
    }

    const user = await authService.signup({ username, email, password, role });

    // Log the action
    logActivity(`User ${user.username} with role ${user.role} just signed up.`);

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

    // Log the action
    logActivity(`User ${result.user.username} logged in.`);

    return sendSuccess(res, "Logged in successfully.", result, 200);

  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const meHandler = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return sendSuccess(res, "Profile fetched successfully.", user);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const logoutHandler = async (req, res) => {
  try {
    // Log activity
    logActivity(`User ${req.user.email} logged out.`);

    return sendSuccess(res, "Logged out successfully.");
  } catch (err) {
    return sendError(res, "Logout failed.", 500);
  }
};


