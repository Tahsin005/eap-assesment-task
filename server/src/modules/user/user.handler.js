import * as userService from "./user.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await userService.listUsers();
    return sendSuccess(res, "Users fetched successfully.", users);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getUserByIdHandler = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    return sendSuccess(res, "User profile fetched successfully.", user);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const createUserHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return sendError(res, "username, email and password are required.", 400);
    }
    const user = await userService.createAdminUser({ username, email, password, role });
    
    logActivity(`Admin (${req.user.username}) created user ${user.username}.`);
    
    return sendSuccess(res, "User created successfully.", user, 201);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updateUserHandler = async (req, res) => {
  try {
    const user = await userService.updateUserDetails(req.params.id, req.body);
    
    logActivity(`Admin (${req.user.username}) updated user ${user.username}.`);
    
    return sendSuccess(res, "User updated successfully.", user);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const deleteUserHandler = async (req, res) => {
  try {
    const user = await userService.removeUser(req.params.id);
    
    logActivity(`Admin (${req.user.username}) deleted user ${user.username}.`);
    
    return sendSuccess(res, "User deleted successfully.");
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const changeRoleHandler = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return sendError(res, "Role is required.", 400);
    
    const user = await userService.changeUserRole(req.params.id, role);
    
    logActivity(`Admin (${req.user.username}) changed role of ${user.username} to ${role}.`);
    
    return sendSuccess(res, `User role updated to ${role} successfully.`, user);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const changeStatusHandler = async (req, res) => {
  try {
    const { is_active } = req.body;
    if (is_active === undefined) return sendError(res, "is_active status is required.", 400);
    
    const user = await userService.changeUserStatus(req.params.id, is_active);
    
    const statusText = is_active ? "activated" : "deactivated";
    logActivity(`Admin (${req.user.username}) ${statusText} user ${user.username}.`);
    
    return sendSuccess(res, `User ${statusText} successfully.`, user);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};
