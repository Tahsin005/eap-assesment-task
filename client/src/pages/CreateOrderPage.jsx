import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Loader2,
  ShoppingCart,
  User,
  Package,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  TableRow 
} from "@/components/ui/table";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useCreateOrderMutation } from "@/store/api/orderApi";

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [basket, setBasket] = useState([]);
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  const { data: productData, isLoading: productsLoading } = useGetProductsQuery({ 
    page: 1, 
    limit: 100,
    search: searchTerm // Assuming search is supported by backend, or we filter locally
  });

  const products = productData?.data || [];

  // Filter products locally for a better UX if backend search isn't perfect
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.status === "active"
  );

  const addToBasket = (product) => {
    const existingItem = basket.find(item => item.product_id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        setBasket(basket.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      }
    } else {
      setBasket([...basket, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock_available: product.stock_quantity
      }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setBasket(basket.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, Math.min(item.quantity + delta, item.stock_available));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromBasket = (productId) => {
    setBasket(basket.filter(item => item.product_id !== productId));
  };

  const totalAmount = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName) return alert("Please enter customer name.");
    if (basket.length === 0) return alert("Please add at least one item to the order.");

    try {
      await createOrder({
        customer_name: customerName,
        items: basket.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      }).unwrap();
      
      navigate("/orders");
    } catch (err) {
      console.error("Order creation failed:", err);
      alert(err?.data?.message || "Failed to create order.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border-none bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Select Products
              </CardTitle>
              <CardDescription>
                Search and add products to your order basket.
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products by name..." 
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  No active products found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(product => {
                    const inBasket = basket.find(item => item.product_id === product.id);
                    const isOutOfStock = product.stock_quantity === 0;
                    
                    return (
                      <div 
                        key={product.id} 
                        className={`p-4 rounded-xl border bg-white shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between gap-3 ${isOutOfStock ? "opacity-60" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-800">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                          </div>
                          <Badge variant="secondary" className="font-bold">
                            ${product.price.toFixed(2)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${product.stock_quantity <= product.minimum_stock_threshold ? "text-amber-600" : "text-emerald-600"}`}>
                              {product.stock_quantity} available
                            </span>
                            {inBasket && (
                              <span className="text-[10px] text-primary font-bold">
                                {inBasket.quantity} in basket
                              </span>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant={inBasket ? "secondary" : "default"}
                            disabled={isOutOfStock || (inBasket && inBasket.quantity >= product.stock_quantity)}
                            onClick={() => addToBasket(product)}
                            className="gap-1 rounded-lg"
                          >
                            <Plus className="h-3 w-3" />
                            {inBasket ? "Add More" : "Add to Order"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Basket */}
        <div className="space-y-6">
          <Card className="shadow-lg border-none overflow-hidden ring-1 ring-slate-200">
            <div className="bg-slate-900 text-white p-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-sky-400" />
                Order Summary
              </CardTitle>
              <p className="text-slate-400 text-xs mt-1">Confirm details and complete order</p>
            </div>
            
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer_name" className="text-xs uppercase font-bold text-slate-500">Customer Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="customer_name" 
                    placeholder="Enter customer name" 
                    className="pl-10"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-500">Items ({basket.length})</h4>
                
                {basket.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed text-muted-foreground text-sm">
                    No items added yet.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {basket.map(item => (
                      <div key={item.product_id} className="flex flex-col gap-2 p-3 rounded-lg border bg-white group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-sm font-semibold truncate leading-tight flex-1">{item.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-400 hover:text-destructive"
                            onClick={() => removeFromBasket(item.product_id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-md"
                              onClick={() => updateQuantity(item.product_id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-md"
                              onClick={() => updateQuantity(item.product_id, 1)}
                              disabled={item.quantity >= item.stock_available}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} ea</p>
                            <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {basket.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Subtotal</span>
                      <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black">
                      <span>Total</span>
                      <span className="text-primary">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}

              <Button 
                className="w-full py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95" 
                disabled={basket.length === 0 || !customerName || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Confirm & Place Order
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                By confirming, you agree that stock will be deducted immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
