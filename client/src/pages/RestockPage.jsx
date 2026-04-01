import React, { useState } from "react";
import {
  ClipboardList,
  Loader2,
  AlertTriangle,
  ArrowUpCircle,
  MoreHorizontal,
  Trash2,
  Package,
  Plus,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsManager } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
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
  useGetRestockQueueQuery,
  useUpdateRestockPriorityMutation,
  useRemoveFromRestockQueueMutation,
  useAddToRestockQueueMutation
} from "@/store/api/restockApi";
import { useGetProductsQuery } from "@/store/api/productApi";

const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1 uppercase text-[10px] font-bold">
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 uppercase text-[10px] font-bold">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 uppercase text-[10px] font-bold">
          Low
        </Badge>
      );
    default:
      return <Badge variant="secondary" className="uppercase text-[10px]">{priority}</Badge>;
  }
};

export default function RestockPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  
  const { data, isLoading, isFetching, error } = useGetRestockQueueQuery({ page, limit });
  const { data: productData } = useGetProductsQuery({ page: 1, limit: 300 });
  const [updatePriority, { isLoading: isUpdating }] = useUpdateRestockPriorityMutation();
  const [removeFromQueue, { isLoading: isRemoving }] = useRemoveFromRestockQueueMutation();
  const [addToQueue, { isLoading: isAdding }] = useAddToRestockQueueMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    priority: "medium"
  });

  const productsForSelection = productData?.data || [];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addToQueue(formData).unwrap();
      setIsOpen(false);
      setFormData({ product_id: "", priority: "medium" });
    } catch (err) {
      console.error("Failed to add to queue:", err);
    }
  };

  const handlePriorityChange = async (id, currentPriority) => {
    const priorities = ["low", "medium", "high"];
    const currentIndex = priorities.indexOf(currentPriority);
    const nextPriority = priorities[(currentIndex + 1) % priorities.length];
    
    try {
      await updatePriority({ id, priority: nextPriority }).unwrap();
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  const handleRemove = async (id, name) => {
    if (window.confirm(`Remove "${name}" from the restock queue?`)) {
      try {
        await removeFromQueue(id).unwrap();
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading restock queue...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Failed to load restock queue</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.data?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  const queue = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restock Queue</h1>
          <p className="text-muted-foreground mt-1">
            Manage products that need inventory replenishment. {meta.total} items pending.
          </p>
        </div>
        {(isAdmin || isManager) && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Add to Queue
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle>Manual Entry</SheetTitle>
                <SheetDescription>
                  Manually add a product to the restock queue and set its priority.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleAddSubmit} className="space-y-6 py-8 px-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_id">Product</Label>
                    <select
                      id="product_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.product_id}
                      onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select Product</option>
                      {productsForSelection.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.stock_quantity} units left)</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Initial Priority</Label>
                    <select
                      id="priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      required
                    >
                      <option value="low">LOW</option>
                      <option value="medium">MEDIUM</option>
                      <option value="high">HIGH</option>
                    </select>
                  </div>
                </div>

                <SheetFooter className="pt-4">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={isAdding} className="gap-2">
                    {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
                    Add Item
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Card className="shadow-sm">
        <div className="px-2">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">Queue is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Products falling below their threshold will automatically appear here.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Product</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Added Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.product.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.product.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-rose-600">{item.product.stock_quantity} units</span>
                            <span className="text-xs text-muted-foreground">/ {item.product.minimum_stock_threshold} min</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-500" 
                              style={{ width: `${Math.min((item.product.stock_quantity / item.product.minimum_stock_threshold) * 100, 100)}%` }}
                             />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handlePriorityChange(item.id, item.priority)}
                          disabled={isUpdating}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <PriorityBadge priority={item.priority} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild title="Manage Product">
                            <Link to={`/products/${item.product.id}`}>
                              <Package className="h-4 w-4" />
                            </Link>
                          </Button>
                          {(isAdmin || isManager) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemove(item.id, item.product.name)}
                              disabled={isRemoving}
                              title="Remove from Queue"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
