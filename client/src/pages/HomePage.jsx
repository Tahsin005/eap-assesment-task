import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, BarChart3, Package, Users } from "lucide-react";

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" to="/">
          <div className="bg-primary p-1.5 rounded-lg">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">SmartInventory</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="#solutions">
            Solutions
          </Link>
          {isAuthenticated ? (
            <Button asChild variant="default" size="sm" className="rounded-full px-5">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="rounded-full px-5">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-48 xl:py-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-background -z-10" />
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-background/50 backdrop-blur-sm animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              New v2.0 is now available
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none mb-6 text-balance">
              Control your <span className="text-primary bg-clip-text">Inventory</span> <br />
              with Precision
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mb-10 text-balance font-medium">
              The all-in-one Smart Inventory & Order Management System for modern businesses. 
              Automate stock, track orders, and gain real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 text-md h-14 shadow-xl shadow-primary/25 group">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 text-md h-14 bg-background/50 backdrop-blur-sm">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t mt-auto">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <Link className="flex items-center gap-2" to="/">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">SmartInventory</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2026 SmartInventory Inc. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8">
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" to="#">
              Terms
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" to="#">
              Privacy
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" to="#">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
