import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Save,
  Trash2,
  Package,
  BadgeDollarSign,
  Layers,
  History,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUpdateStatusMutation,
  useAdjustStockMutation,
  useDeleteProductMutation,
  useGetProductMovementsQuery
} from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { selectIsAdmin } from "@/store/slices/authSlice";

const MovementTypeBadge = ({ type }) => {
  switch (type) {
    case "ORDER_DEDUCT":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px]">Order</Badge>;
    case "RESTOCK_ADD":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px]">Restock</Badge>;
    case "CANCEL_RETURN":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 uppercase text-[10px]">Return</Badge>;
    case "MANUAL_ADJUST":
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 uppercase text-[10px]">Manual</Badge>;
    default:
      return <Badge variant="secondary" className="uppercase text-[10px]">{type}</Badge>;
  }
};

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

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const { data: response, isLoading, error } = useGetProductByIdQuery(id);
  const { data: categories } = useGetCategoriesQuery();
  
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateStatusMutation();
  const [adjustStock, { isLoading: isAdjustingStock }] = useAdjustStockMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [movementPage, setMovementPage] = useState(1);
  const { data: movementsResponse, isFetching: isFetchingMovements } = useGetProductMovementsQuery({ id, page: movementPage, limit: 5 });

  const product = response?.data;
  const movements = movementsResponse?.data || [];
  const movementsMeta = movementsResponse?.meta;

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    minimum_stock_threshold: ""
  });

  const [stockData, setStockData] = useState({
    quantity_change: "",
    movement_type: "RESTOCK_ADD",
    note: ""
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category_id: product.category_id || "",
        price: product.price || "",
        minimum_stock_threshold: product.minimum_stock_threshold || 0
      });
    }
  }, [product]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setStockData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        id,
        ...formData,
        price: parseFloat(formData.price),
        minimum_stock_threshold: parseInt(formData.minimum_stock_threshold)
      }).unwrap();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    try {
      const change = parseInt(stockData.quantity_change);
      
      const finalChange = parseInt(stockData.quantity_change);

      await adjustStock({
        id,
        quantity_change: finalChange,
        movement_type: stockData.movement_type,
        note: stockData.note
      }).unwrap();

      setStockData({
        quantity_change: "",
        movement_type: "RESTOCK_ADD",
        note: ""
      });
    } catch (err) {
      console.error("Adjustment failed:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(id).unwrap();
        navigate("/products");
      } catch (err) {
        console.error("Deletion failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading product details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Product not found</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mt-2">
          {error.data?.message || "The product you are looking for does not exist."}
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={product?.status} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider tabular-nums">{product?.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Product Information
              </CardTitle>
              <CardDescription>Update general details about this product.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleFormChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum_stock_threshold">Minimum Stock Threshold</Label>
                  <Input id="minimum_stock_threshold" name="minimum_stock_threshold" type="number" value={formData.minimum_stock_threshold} onChange={handleFormChange} required />
                  <p className="text-[10px] text-muted-foreground">Alerts will be triggered when stock falls below this value.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-between py-3">
                 <p className="text-xs text-muted-foreground">
                  Created by {product?.creator?.username || "System"} on {new Date(product?.createdAt).toLocaleDateString()}
                </p>
                <Button type="submit" disabled={isUpdating} size="sm" className="gap-2">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Details
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Stock History Placeholder or Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Stock Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Current</p>
                  <p className="text-2xl font-bold">{product?.stock_quantity}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-600 uppercase mb-1 tracking-tight">Status</p>
                  <p className="text-sm font-bold text-emerald-700 capitalize">{product?.status}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-600 uppercase mb-1 tracking-tight">Threshold</p>
                  <p className="text-sm font-bold text-amber-700">{product?.minimum_stock_threshold}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Movement History */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Stock Movement History
                </CardTitle>
                <CardDescription>Latest inventory adjustments and movements.</CardDescription>
              </div>
              {isFetchingMovements && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              {movements.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No movements recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[110px]">Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                          <TableHead className="text-right">Stock</TableHead>
                          <TableHead>By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movements.map((m) => (
                          <TableRow key={m.id} className="text-xs group hover:bg-muted/30">
                            <TableCell className="text-muted-foreground">
                              {new Date(m.createdAt).toLocaleDateString()}
                              <div className="text-[10px] opacity-70">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <MovementTypeBadge type={m.movement_type} />
                                {m.note && <span className="text-[10px] text-muted-foreground italic truncate max-w-[100px]" title={m.note}>{m.note}</span>}
                              </div>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${m.quantity_change > 0 ? "text-emerald-600" : "text-destructive"}`}>
                              {m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              <span className="text-muted-foreground line-through mr-1 opacity-50">{m.previous_stock}</span>
                              <span className="font-semibold">{m.new_stock}</span>
                            </TableCell>
                            <TableCell className="font-medium whitespace-nowrap">
                              {m.user?.username || "Sys"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {movementsMeta?.totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setMovementPage(p => Math.max(1, p - 1))}
                            className={movementPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-xs font-medium px-2">
                             {movementPage} / {movementsMeta.totalPages}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setMovementPage(p => Math.min(movementsMeta.totalPages, p + 1))}
                            className={movementPage === movementsMeta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Actions / Status */}
          <Card className="shadow-sm border-none ring-1 ring-border overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {["active", "inactive", "out_of_stock"].map((status) => (
                <Button
                  key={status}
                  variant={product?.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  disabled={isStatusUpdating}
                  className="w-full justify-start gap-2 capitalize"
                >
                  {product?.status === status ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-4" />}
                  {status.replace(/_/g, ' ')}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Stock Adjustment */}
          <Card className="shadow-sm border-none ring-1 ring-border overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Inventory Adjustment</span>
                <Layers className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleAdjustStock}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Movement Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={stockData.movement_type === "RESTOCK_ADD" ? "default" : "secondary"}
                      size="sm"
                      className={`flex-1 text-[10px] h-8 font-black tracking-tight ${stockData.movement_type === "RESTOCK_ADD" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      onClick={() => setStockData(prev => ({ ...prev, movement_type: "RESTOCK_ADD" }))}
                    >
                      RESTOCK ADD
                    </Button>
                    <Button
                      type="button"
                      variant={stockData.movement_type === "MANUAL_ADJUST" ? "default" : "secondary"}
                      size="sm"
                      className={`flex-1 text-[10px] h-8 font-black tracking-tight ${stockData.movement_type === "MANUAL_ADJUST" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-100 text-slate-500"}`}
                      onClick={() => setStockData(prev => ({ ...prev, movement_type: "MANUAL_ADJUST" }))}
                    >
                      MANUAL ADJUST
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity_change">Quantity Change</Label>
                  <Input
                    id="quantity_change"
                    name="quantity_change"
                    type="number"
                    value={stockData.quantity_change}
                    onChange={handleStockChange}
                    placeholder="Use positive for add, negative for reduce"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground italic">Positive = Increase, Negative = Decrease</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    name="note"
                    value={stockData.note}
                    onChange={handleStockChange}
                    placeholder="Restock, Sale, etc."
                  />
                </div>

                <Button type="submit" disabled={isAdjustingStock} className="w-full">
                  {isAdjustingStock ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirm Adjustment
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Danger Zone */}
          {isAdmin && (
            <Card className="shadow-sm border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3 text-destructive">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Area
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Deleting this product will remove it forever. This cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full gap-2"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete Product
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
