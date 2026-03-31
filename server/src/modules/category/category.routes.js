import { Router } from "express";
import {
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "./category.handler.js";
import { authenticate, authorise } from "../../middlewares/auth.middleware.js";

const router = Router();

// accessible by ADMIN and MANAGER
router.use(authenticate, authorise("ADMIN", "MANAGER"));

router.get("/", getAllCategoriesHandler);
router.get("/:id", getCategoryByIdHandler);
router.post("/", createCategoryHandler);
router.patch("/:id", updateCategoryHandler);

// ADMIN only
router.delete("/:id", authorise("ADMIN"), deleteCategoryHandler);

export default router;
