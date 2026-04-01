import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"

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

const Profile = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">Profile</h1>
    <p className="text-muted-foreground">Manage your account information.</p>
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
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App