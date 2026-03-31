import * as categoryRepo from "./category.repository.js";

export const listCategories = async () => {
  return await categoryRepo.getAllCategories();
};

export const getCategory = async (id) => {
  const category = await categoryRepo.getCategoryById(id);
  if (!category) throw { status: 404, message: "Category not found." };
  return category;
};

export const addCategory = async ({ name, created_by }) => {
  const existing = await categoryRepo.findCategoryByName(name);
  if (existing) throw { status: 409, message: "Category name already exists." };

  return await categoryRepo.createCategory({ name, created_by });
};

export const editCategory = async (id, name) => {
  const existing = await categoryRepo.findCategoryByName(name);
  if (existing && existing.id !== id) {
    throw { status: 409, message: "Another category with this name already exists." };
  }

  try {
    return await categoryRepo.updateCategory(id, { name });
  } catch (error) {
    throw { status: 404, message: "Category not found." };
  }
};

export const removeCategory = async (id) => {
  try {
    return await categoryRepo.deleteCategory(id);
  } catch (error) {
    throw { status: 404, message: "Category not found." };
  }
};
