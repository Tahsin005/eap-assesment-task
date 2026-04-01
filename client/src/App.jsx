import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

const Dashboard = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p className="text-muted-foreground">Welcome to the Smart Inventory & Order Management System.</p>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="font-semibold leading-none tracking-tight">Total Orders</h3>
        <p className="text-2xl font-bold mt-2">1,234</p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="font-semibold leading-none tracking-tight">Active Inventory</h3>
        <p className="text-2xl font-bold mt-2">456</p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="font-semibold leading-none tracking-tight">Revenue</h3>
        <p className="text-2xl font-bold mt-2">$12,345</p>
      </div>
    </div>
  </div>
)



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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App