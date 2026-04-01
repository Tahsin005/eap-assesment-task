import React, { useState } from "react";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  PackageCheck,
  Calendar,
  User,
  ShoppingBag,
  History,
  Trash2,
  Slash
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  useGetOrderByIdQuery, 
  useUpdateOrderStatusMutation, 
  useCancelOrderMutation,
  useGetOrderMovementsQuery
} from "@/store/api/orderApi";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 capitalize px-3 py-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 capitalize px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 gap-1 capitalize px-3 py-1">
          <Truck className="h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 capitalize px-3 py-1">
          <PackageCheck className="h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1 capitalize px-3 py-1">
          <XCircle className="h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary" className="px-3 py-1">{status}</Badge>;
  }
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const { data: order, isLoading: orderLoading, error: orderError } = useGetOrderByIdQuery(id);
  const { data: movementsData, isLoading: movementsLoading } = useGetOrderMovementsQuery({ id });
  
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Status update failed:", err);
      alert(err?.data?.message || "Failed to update status.");
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this order? Stock will be returned to inventory.")) {
      try {
        await cancelOrder(id).unwrap();
      } catch (err) {
        console.error("Cancellation failed:", err);
        alert(err?.data?.message || "Failed to cancel order.");
      }
    }
  };

  if (orderLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Loading order details...</h3>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Order not found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {orderError?.data?.message || "The order you are looking for does not exist."}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const movements = movementsData?.data || [];
  const items = order?.items || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2">
            <Link to="/orders" className="flex items-center gap-1 text-sm font-medium">
              <ArrowLeft className="h-4 w-4" />
              Orders
            </Link>
            <Slash className="h-3 w-3 opacity-20" />
            <span className="text-xs font-mono">{order.id}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
            Order Detail
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <StatusBadge status={order.status} />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <>
              {order.status === "pending" && (
                <Button 
                  onClick={() => handleStatusUpdate("confirmed")} 
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Confirm Order
                </Button>
              )}
              {order.status === "confirmed" && (
                <Button 
                  onClick={() => handleStatusUpdate("shipped")} 
                  disabled={isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Truck className="h-4 w-4 mr-2" />}
                  Mark as Shipped
                </Button>
              )}
              {order.status === "shipped" && (
                <Button 
                  onClick={() => handleStatusUpdate("delivered")} 
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PackageCheck className="h-4 w-4 mr-2" />}
                  Mark as Delivered
                </Button>
              )}
              <Button 
                variant="outline" 
                className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Cancel Order
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Info & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details Card */}
          <Card className="shadow-sm border-none bg-white ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Customer & Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Name</p>
                      <p className="text-lg font-bold text-slate-900">{order.customer_name}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <PackageCheck className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processed By</p>
                      <p className="text-lg font-bold text-slate-900">{order.creator?.username || "System"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table Card */}
          <Card className="shadow-sm border-none bg-white ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg">Order Items</CardTitle>
              <CardDescription>All products included in this order</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right pr-6">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div>
                          <div className="font-bold text-slate-800">{item.product.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{item.product_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                      <TableCell className="font-medium text-slate-700">{item.quantity} x</TableCell>
                      <TableCell className="text-right pr-6 font-black text-slate-900">
                        ${item.subtotal_price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 border-t bg-slate-50/30 flex justify-end items-center gap-12">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-3xl font-black text-primary animate-pulse-subtle">
                    ${(order?.total_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline / History */}
        <div className="space-y-6">
          <Card className="shadow-sm border-none bg-white ring-1 ring-slate-200 overflow-hidden">
            <CardHeader className="border-b bg-slate-900 text-white py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-sky-400" />
                Stock Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {movementsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : movements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No stock movements recorded.
                </div>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {movements.map((mv) => (
                    <div key={mv.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          mv.movement_type === 'ORDER_DEDUCT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {mv.movement_type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(mv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{mv.product.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={mv.quantity_change < 0 ? "destructive" : "default"} className="h-5 px-1.5 font-bold">
                          {mv.quantity_change > 0 ? "+" : ""}{mv.quantity_change}
                        </Badge>
                        <div className="flex flex-col text-[10px] text-muted-foreground font-medium">
                          <span>Prev: {mv.previous_stock}</span>
                          <span className="text-slate-800 font-bold">New: {mv.new_stock}</span>
                        </div>
                      </div>
                      {mv.note && <p className="text-[10px] mt-2 italic text-slate-400 border-l-2 pl-2">"{mv.note}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
