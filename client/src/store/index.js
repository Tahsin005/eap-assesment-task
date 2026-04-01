import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { categoryApi } from "./api/categoryApi";
import { productApi } from "./api/productApi";
import { restockApi } from "./api/restockApi";
import { orderApi } from "./api/orderApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [restockApi.reducerPath]: restockApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      userApi.middleware, 
      categoryApi.middleware,
      productApi.middleware,
      restockApi.middleware,
      orderApi.middleware
    ),
});
