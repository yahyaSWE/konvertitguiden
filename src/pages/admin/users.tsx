import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { UserManagement } from "@/components/admin/user-management";
import { UserRole } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function AdminUsers() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Check admin role
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && user.role !== UserRole.ADMIN) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <UserManagement />
      </div>
    </AppLayout>
  );
}
