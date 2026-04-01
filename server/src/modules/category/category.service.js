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
  // Unique name constraint is handled in the repository via Prisma P2002
  return await categoryRepo.updateCategory(id, { name });
};

export const removeCategory = async (id) => {
  // Relation constraint (P2003) is handled in the repository
  return await categoryRepo.deleteCategory(id);
};
