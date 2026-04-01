import { useGetMeQuery } from "@/store/api/authApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Shield, Calendar, UserCheck } from "lucide-react";

export default function ProfilePage() {
  const { data, isLoading, error } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Card className="shadow-md">
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error loading profile</h2>
          <p className="text-muted-foreground mt-2">{error.data?.message || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const user = data?.data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md overflow-hidden border-t-4 border-t-primary">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.username}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account Role</p>
                  <p className="font-semibold">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                <UserCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="font-semibold">{user?.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Member Since</p>
                  <p className="font-semibold">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
