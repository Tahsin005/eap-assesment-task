import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  User as UserIcon,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateRoleMutation,
  useUpdateStatusMutation
} from "@/store/api/userApi";

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useGetUserQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateRole, { isLoading: isRoleUpdating }] = useUpdateRoleMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateStatusMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    is_active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        is_active: user.is_active ?? true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id, ...formData }).unwrap();
      // Success notification could go here
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser(id).unwrap();
        navigate("/users");
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      await updateStatus({ id, is_active: !formData.is_active }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      await updateRole({ id, role: newRole }).unwrap();
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading user details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">User not found</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mt-2">
          The user you are looking for does not exist or has been removed.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground mt-0.5">Manage profile, role, and permissions.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <div className="px-6 pt-6 pb-2">
          <h3 className="font-semibold text-base leading-snug">Profile Information</h3>
          <p className="text-sm text-muted-foreground mt-1">Update user personal details.</p>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="px-6 pb-2 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john_doe"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="h-10"
              />
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <p className="text-xs text-muted-foreground italic">
              Last updated: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Never"}
            </p>
            <Button type="submit" disabled={isUpdating} className="gap-2">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-sm">
        <div className="px-6 pt-6 pb-2">
          <h3 className="font-semibold text-base leading-snug">Account Status & Role</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage user permissions and system access.</p>
        </div>
        <div className="px-6 pb-6 space-y-6">
          <div className="flex items-start justify-between gap-6 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Account Status</p>
              <p className="text-xs text-muted-foreground">Active users can log in and access the system.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge variant={formData.is_active ? "success" : "secondary"}>
                {formData.is_active ? "Active" : "Inactive"}
              </Badge>
              <Button
                variant={formData.is_active ? "outline" : "default"}
                size="sm"
                onClick={handleToggleStatus}
                disabled={isStatusUpdating}
                className="gap-2 min-w-[110px]"
              >
                {isStatusUpdating
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : formData.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                {formData.is_active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">System Role</p>
              <p className="text-xs text-muted-foreground">Grant or revoke administrative permissions for this user.</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              {["ADMIN", "MANAGER"].map((role) => (
                <Button
                  key={role}
                  variant={formData.role === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoleChange(role)}
                  disabled={isRoleUpdating}
                  className="h-9 px-5 text-xs font-medium transition-all"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-sm border-destructive/20 bg-destructive/5">
        <div className="px-6 pt-6 pb-2">
          <h3 className="font-semibold text-base leading-snug text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Irreversible actions for this account.</p>
        </div>
        <div className="px-6 pb-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Once deleted, all associated data for this user will be permanently removed and cannot be recovered.
            </p>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2 shrink-0"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
