import * as categoryService from "./category.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { logActivity } from "../../utils/activity.js";

export const getAllCategoriesHandler = async (req, res) => {
  try {
    const categories = await categoryService.listCategories();
    return sendSuccess(res, "Categories fetched successfully.", categories);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const getCategoryByIdHandler = async (req, res) => {
  try {
    const category = await categoryService.getCategory(req.params.id);
    return sendSuccess(res, "Category fetched successfully.", category);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const createCategoryHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return sendError(res, "Name is required.", 400);

    const category = await categoryService.addCategory({ 
      name, 
      created_by: req.user.id 
    });

    logActivity(`${req.user.role} (${req.user.username}) created category "${name}".`);

    return sendSuccess(res, "Category created successfully.", category, 201);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const updateCategoryHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return sendError(res, "Name is required.", 400);

    const category = await categoryService.editCategory(req.params.id, name);

    logActivity(`${req.user.role} (${req.user.username}) updated category to "${name}".`);

    return sendSuccess(res, "Category updated successfully.", category);
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};

export const deleteCategoryHandler = async (req, res) => {
  try {
    const category = await categoryService.removeCategory(req.params.id);

    logActivity(`Admin (${req.user.username}) deleted category "${category.name}".`);

    return sendSuccess(res, "Category deleted successfully.");
  } catch (err) {
    return sendError(res, err.message || "Internal server error.", err.status || 500);
  }
};
