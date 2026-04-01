import React, { useState } from "react";
import {
  ClipboardList,
  Loader2,
  AlertTriangle,
  Trash2,
  Package,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsManager } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  useGetRestockQueueQuery,
  useRemoveFromRestockQueueMutation
} from "@/store/api/restockApi";

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
  const [removeFromQueue, { isLoading: isRemoving }] = useRemoveFromRestockQueueMutation();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleRemove = async (id, name) => {
    if (window.confirm(`Mark "${name}" as restocked and remove from queue?`)) {
      try {
        await removeFromQueue(id).unwrap();
      } catch (err) {
        console.error("Failed to remove item:", err);
        alert(err?.data?.message || "Failed to remove item from queue.");
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase font-black">Restock Queue</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">
            Manage products that need inventory replenishment. <span className="text-slate-900 font-bold">{meta.total}</span> items pending.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white ring-1 ring-slate-200">
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
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-[35%] py-4 pl-6">Product</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Added Date</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{item.product.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{item.product.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-rose-600">{item.product.stock_quantity} units</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">/ {item.product.minimum_stock_threshold} min</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50">
                            <div 
                              className={`h-full ${item.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min((item.product.stock_quantity / (item.product.minimum_stock_threshold || 1)) * 100, 100)}%` }}
                             />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={item.priority} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground font-medium">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild title="Manage Product" className="hover:bg-slate-100">
                            <Link to={`/products/${item.product.id}`}>
                              <Package className="h-4 w-4 text-slate-600" />
                            </Link>
                          </Button>
                          {(isAdmin || isManager) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleRemove(item.id, item.product.name)}
                              disabled={isRemoving}
                              title="Restock & Remove"
                            >
                              <RefreshCw className={`h-4 w-4 mr-1 ${isRemoving ? 'animate-spin' : ''}`} />
                              Restock
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {meta.totalPages > 1 && (
                <div className="py-4 border-t px-6 bg-slate-50/30">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page - 1);
                          }}
                          className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
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
                          className={page === meta.totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
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
