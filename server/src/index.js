import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import restockRoutes from "./modules/restock/restock.routes.js";
import stockRoutes from "./modules/stock/stock.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import activityRoutes from "./modules/activity/activity.routes.js";

import { sendSuccess } from "./utils/response.js";

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        const allowedOrigins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://smart-invetory-management-mu.vercel.app",
            "https://eap-assesment-task-five.vercel.app",
            "https://smartinventory-theta.vercel.app"
        ];
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.use(express.json());

const API_SUFFIX = "/api/v1"

// routes
app.use(`${API_SUFFIX}/auth`, authRoutes);
app.use(`${API_SUFFIX}/users`, userRoutes);
app.use(`${API_SUFFIX}/categories`, categoryRoutes);
app.use(`${API_SUFFIX}/products`, productRoutes);
app.use(`${API_SUFFIX}/restock-queue`, restockRoutes);
app.use(`${API_SUFFIX}/stock-movements`, stockRoutes);
app.use(`${API_SUFFIX}/orders`, orderRoutes);
app.use(`${API_SUFFIX}/dashboard`, dashboardRoutes);
app.use(`${API_SUFFIX}/activities`, activityRoutes);

// health check
app.get("/", (req, res) => {
    return sendSuccess(res, "Server is running.");
});

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

export default app;

