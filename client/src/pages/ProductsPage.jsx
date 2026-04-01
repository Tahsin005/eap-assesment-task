import React, { useState } from "react";
import {
  Package,
  Loader2,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Plus,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsManager } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { 
  useGetProductsQuery, 
  useDeleteProductMutation,
  useCreateProductMutation 
} from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 capitalize">
          <CheckCircle2 className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "out_of_stock":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 capitalize">
          <AlertCircle className="h-3 w-3" />
          {status.replace(/_/g, ' ')}
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1 capitalize">
          <XCircle className="h-3 w-3" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  const { data, isLoading, isFetching, error } = useGetProductsQuery({ page, limit });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    stock_quantity: "",
    minimum_stock_threshold: ""
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        minimum_stock_threshold: parseInt(formData.minimum_stock_threshold) || 0
      }).unwrap();
      
      setIsOpen(false);
      setFormData({
        name: "",
        category_id: "",
        price: "",
        stock_quantity: "",
        minimum_stock_threshold: ""
      });
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id).unwrap();
      } catch (err) {
        console.error("Deletion failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading products...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Failed to load products</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.data?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your inventory. {meta.total} products total.
          </p>
        </div>
        {(isAdmin || isManager) && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle>Create New Product</SheetTitle>
                <SheetDescription>
                  Enter the details of the new product to add it to the inventory.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleCreateProduct} className="space-y-6 py-8 px-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleFormChange} 
                      placeholder="e.g. Wireless Mouse" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <select
                      id="category_id"
                      name="category_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      {categories?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={handleFormChange} 
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Initial Stock</Label>
                      <Input 
                        id="stock_quantity" 
                        name="stock_quantity" 
                        type="number" 
                        value={formData.stock_quantity} 
                        onChange={handleFormChange} 
                        placeholder="0" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimum_stock_threshold">Minimum Stock Threshold</Label>
                    <Input 
                      id="minimum_stock_threshold" 
                      name="minimum_stock_threshold" 
                      type="number" 
                      value={formData.minimum_stock_threshold} 
                      onChange={handleFormChange} 
                      placeholder="5" 
                      required 
                    />
                    <p className="text-[10px] text-muted-foreground italic">Alerts will trigger when stock falls below this level.</p>
                  </div>
                </div>

                <SheetFooter className="pt-4">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={isCreating} className="gap-2">
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Product
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Card className="shadow-sm">
        <div className="px-2">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Wait for products to be added to the system.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="text-sm font-semibold">{product.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{product.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={product.stock_quantity <= product.minimum_stock_threshold ? "text-amber-600 font-bold" : ""}>
                            {product.stock_quantity} units
                          </span>
                          {product.stock_quantity <= product.minimum_stock_threshold && (
                            <span className="text-[10px] text-amber-500 font-medium">Low Stock</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} />
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/products/${product.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {meta.totalPages > 1 && (
                <div className="py-4 border-t px-6 bg-muted/10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page - 1);
                          }}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {[...Array(meta.totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={page === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i + 1);
                            }}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page + 1);
                          }}
                          className={page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
