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
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-background -z-10" />
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-background/50 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              Trusted by 500+ businesses worldwide
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none mb-6 text-balance">
              Smart <span className="text-primary">Inventory</span> & <br />
              Order Management
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mb-10 text-balance font-medium">
              Eliminate stockouts, automate ordering, and gain real-time visibility into your warehouse operations. 
              Built for precision and scale.
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

        <section id="features" className="w-full py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-bold">
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to scale</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A comprehensive suite of tools designed to handle every aspect of your inventory lifecycle.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Dashboard",
                  description: "Monitor total items, pending orders, and system-wide metrics at a glance.",
                  icon: BarChart3
                },
                {
                  title: "Inventory Control",
                  description: "Full CRUD for products and categories with automated stock threshold alerts.",
                  icon: Package
                },
                {
                  title: "Order Management",
                  description: "Automated stock deduction and status tracking for all customer orders.",
                  icon: CheckCircle2
                },
                {
                  title: "Stock Movements",
                  description: "Detailed audit trail for every change—restocks, manual adjusts, and sales.",
                  icon: Zap
                },
                {
                  title: "Restock Queue",
                  description: "Priority-based replenishment system to ensure you never run out of top sellers.",
                  icon: ArrowRight
                },
                {
                  title: "Admin RBAC",
                  description: "Secure, role-based access control for Admins and Managers for optimized workflow.",
                  icon: ShieldCheck
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl border bg-background hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 duration-300">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight">
                  The Audit Trail You Can <span className="text-primary">Trust</span>
                </h2>
                <p className="text-muted-foreground text-lg italic leading-relaxed">
                  Every single stock change is recorded in our activity logs and stock movement history. 
                  Know exactly who changed what, when, and why.
                </p>
                <ul className="space-y-4 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>Granular Activity Logs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>Inventory History Audits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>Automated Restock Alerts</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link to="/signup">Start Auditing Today</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden border shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="flex items-center justify-center h-full bg-muted/20">
                  <BarChart3 className="h-32 w-32 text-primary/40 animate-pulse" />
                </div>
              </div>
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
