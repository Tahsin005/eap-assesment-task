import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import UsersPage from "./pages/UsersPage"
import CategoriesPage from "./pages/CategoriesPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import ManagerRoute from "./components/ManagerRoute"
import PublicRoute from "./components/PublicRoute"
import UserDetailsPage from "./pages/UserDetailsPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import RestockPage from "./pages/RestockPage"
import OrdersPage from "./pages/OrdersPage"
import CreateOrderPage from "./pages/CreateOrderPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import DashboardPage from "./pages/DashboardPage"
import ActivitiesPage from "./pages/ActivitiesPage"

const Settings = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">Settings</h1>
    <p className="text-muted-foreground">Configure system preferences.</p>
  </div>
)

const App = () => {
  return (
    <Routes>
      {/* public Routes */}
      <Route path="/" element={<HomePage />} />
      
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Admin Only Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<Layout />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Route>
      </Route>

      {/* ADMIN + MANAGER Routes */}
      <Route element={<ManagerRoute />}>
        <Route element={<Layout />}>
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/restock" element={<RestockPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<CreateOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App