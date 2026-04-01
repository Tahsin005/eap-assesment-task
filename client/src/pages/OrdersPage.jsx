import React, { useState } from "react";
import {
  ClipboardList,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  PackageCheck,
  Eye,
  Trash2,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/authSlice";
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
  useGetOrdersQuery, 
  useDeleteOrderMutation 
} from "@/store/api/orderApi";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 capitalize">
          <AlertCircle className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 capitalize">
          <CheckCircle2 className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 gap-1 capitalize">
          <Truck className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 capitalize">
          <PackageCheck className="h-3 w-3" />
          {status}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1 capitalize">
          <XCircle className="h-3 w-3" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const isAdmin = useSelector(selectIsAdmin);
  const { data, isLoading, isFetching, error } = useGetOrdersQuery({ page, limit });
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleDelete = async (id, customerName) => {
    if (window.confirm(`Are you sure you want to delete order for "${customerName}"?`)) {
      try {
        await deleteOrder(id).unwrap();
      } catch (err) {
        console.error("Deletion failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading orders...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Failed to load orders</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.data?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  const orders = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and manage customer orders. {meta.total} total orders.
          </p>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link to="/orders/new">
            <Plus className="h-4 w-4" />
            Create Order
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <div className="px-2">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Wait for orders to be placed.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-xs font-mono">
                        {order.id}
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell className="font-semibold">
                        ${order.total_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(order.id, order.customer_name)}
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
