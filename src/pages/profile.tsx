import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { UserProfile } from "@/components/profile/user-profile";

interface ProfileProps {
  params?: {
    id?: string;
  };
}

export default function Profile({ params }: ProfileProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const userId = params?.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <AppLayout>
      <div className="p-6">
        <UserProfile userId={userId} />
      </div>
    </AppLayout>
  );
}
