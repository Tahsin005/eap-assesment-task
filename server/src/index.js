import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import activityRoutes from "./modules/activity/activity.routes.js";
import { sendSuccess } from "./utils/response.js";

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const API_SUFFIX = "/api/v1"

// routes
app.use(`${API_SUFFIX}/auth`, authRoutes);
app.use(`${API_SUFFIX}/users`, userRoutes);
app.use(`${API_SUFFIX}/categories`, categoryRoutes);
app.use(`${API_SUFFIX}/products`, productRoutes);
app.use(`${API_SUFFIX}/activities`, activityRoutes);


// health check
app.get("/", (req, res) => {
    return sendSuccess(res, "Server is running.");
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

