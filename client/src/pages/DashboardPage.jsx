import React from "react";
import { 
  Users, 
  Package, 
  Layers, 
  ShoppingBag, 
  BadgeDollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetSummaryQuery,
  useGetRevenueTodayQuery,
  useGetLowStockCountQuery,
  useGetOrderDistributionQuery,
} from "@/store/api/dashboardApi";
import { useGetOrdersQuery } from "@/store/api/orderApi";

const StatCard = ({ title, value, icon: Icon, description, colorClass, link }) => (
  <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 bg-white group hover:ring-primary/40 transition-all duration-300">
    <CardContent className="p-0">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
            <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          {link && (
            <Link to={link} className="text-slate-400 hover:text-primary transition-colors">
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
          <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{value}</p>
          {description && <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{description}</p>}
        </div>
      </div>
      <div className={`h-1 w-full ${colorClass}`} />
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useGetSummaryQuery();
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueTodayQuery();
  const { data: lowStockData, isLoading: lowStockLoading } = useGetLowStockCountQuery();
  const { data: distribution, isLoading: distributionLoading } = useGetOrderDistributionQuery();
  const { data: recentOrdersData, isLoading: ordersLoading } = useGetOrdersQuery({ limit: 5 });

  const recentOrders = recentOrdersData?.data || [];

  const isLoading = summaryLoading || revenueLoading || lowStockLoading || distributionLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">Calculating metrics...</h3>
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Revenue",
      value: `$${revenueData?.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`,
      icon: BadgeDollarSign,
      description: "Net revenue from non-cancelled orders today",
      colorClass: "bg-emerald-500",
    },
    {
      title: "Active Products",
      value: summary?.products || 0,
      icon: Package,
      description: "Total items in your inventory",
      colorClass: "bg-indigo-500",
      link: "/products"
    },
    {
      title: "Low Stock Alert",
      value: lowStockData?.count || 0,
      icon: AlertTriangle,
      description: "Items below minimum threshold",
      colorClass: lowStockData?.count > 0 ? "bg-rose-500" : "bg-slate-300",
      link: "/restock"
    },
    {
      title: "Total Orders",
      value: summary?.orders || 0,
      icon: ShoppingBag,
      description: "Lifetime order volume",
      colorClass: "bg-amber-500",
      link: "/orders"
    }
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">System Intelligence</h1>
        <p className="text-slate-500 font-medium italic">
          Real-time performance metrics and inventory insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Distribution */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>Breakdown of current order lifecycle states.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {distribution?.length === 0 ? (
                <p className="text-center py-10 text-slate-400 italic">No orders to display.</p>
              ) : (
                distribution?.map((item) => {
                  const percentage = Math.round((item.count / (summary?.orders || 1)) * 100);
                  const getStatusColor = (status) => {
                    switch(status) {
                        case 'pending': return 'bg-amber-400';
                        case 'confirmed': return 'bg-blue-400';
                        case 'shipped': return 'bg-indigo-400';
                        case 'delivered': return 'bg-emerald-400';
                        case 'cancelled': return 'bg-rose-400';
                        default: return 'bg-slate-400';
                    }
                  };
                  return (
                    <div key={item.status} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize font-bold text-slate-700">{item.status}</span>
                        <span className="tabular-nums font-black text-slate-900">{item.count} <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span></span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStatusColor(item.status)} transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Layers className="h-5 w-5 text-indigo-400" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 pb-8">
             <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Users</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black">{summary?.users || 0}</span>
                  <Users className="h-3 w-3 text-indigo-400" />
                </div>
             </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Categories</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black">{summary?.categories || 0}</span>
                  <Layers className="h-3 w-3 text-amber-400" />
                </div>
             </div>
             <div className="col-span-2 p-4 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-between">
                <div>
                   <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">System Status</p>
                   <p className="text-sm font-bold mt-1 text-indigo-100">All modules operational</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-indigo-400 opacity-50" />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Quick overview of the latest 5 orders.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/orders" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentOrders.length === 0 ? (
                <p className="text-center py-10 text-slate-400 italic">No recent orders yet.</p>
            ) : (
                recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800">{order.customer_name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Order ID: {order.id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900">${order.total_price.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <Link to={`/orders/${order.id}`} className="p-1 px-2 rounded-md hover:bg-slate-200 transition-colors">
                                <ArrowRight className="h-4 w-4 text-slate-400" />
                            </Link>
                        </div>
                    </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
