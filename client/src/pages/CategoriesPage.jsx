import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/authSlice";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderOpen,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api/categoryApi";

export default function CategoriesPage() {
  const isAdmin = useSelector(selectIsAdmin);

  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory({ name: newName.trim() }).unwrap();
      setNewName("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      alert(err?.data?.message || "Failed to create category.");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateCategory({ id, name: editName.trim() }).unwrap();
      setEditingId(null);
      setEditName("");
    } catch (err) {
      console.error("Failed to update category:", err);
      alert(err?.data?.message || "Failed to update category.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This action cannot be undone.`)) return;
    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(err?.data?.message || "Failed to delete category.");
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading categories...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Failed to load categories</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.data?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories. {categories?.length || 0} total.
          </p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <div className="px-6 pt-5 pb-1">
            <h3 className="font-semibold text-base">New Category</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Enter a unique name for the category.</p>
          </div>
          <div className="px-6 pb-5 pt-3">
            <form onSubmit={handleCreate} className="flex gap-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Electronics"
                className="h-10 flex-1"
                autoFocus
              />
              <Button type="submit" disabled={isCreating || !newName.trim()} className="gap-2">
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Create
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setShowAddForm(false); setNewName(""); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Card className="shadow-sm">
        <div className="px-2">
          {categories?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No categories yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                Create your first category to start organizing products.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdate(category.id);
                              if (e.key === "Escape") cancelEditing();
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdate(category.id)}
                            disabled={isUpdating || !editName.trim()}
                          >
                            {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 text-emerald-600" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={cancelEditing}
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      ) : (
                        category.name
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{category.creator?.username || "Unknown"}</span>
                        <Badge variant={category.creator?.role === "ADMIN" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {category.creator?.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(category.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editingId !== category.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => startEditing(category)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(category.id, category.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
