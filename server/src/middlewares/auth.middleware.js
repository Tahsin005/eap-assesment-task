import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";

/**
 * Middleware to protect routes.
 * Expects: Authorization: Bearer <token>
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Access denied. No token provided.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return sendError(res, "Invalid or expired token.", 401);
  }
};

/**
 * Middleware factory to restrict by role(s).
 * Usage: authorise("ADMIN") or authorise("ADMIN", "MANAGER")
 */
export const authorise = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, "Forbidden. Insufficient permissions.", 403);
    }
    next();
  };
};

