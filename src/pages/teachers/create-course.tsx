import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { CourseEditor } from "@/components/courses/course-editor";
import { UserRole } from "@shared/schema";

export default function CreateCourse() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Check authentication and role
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && user.role === UserRole.STUDENT) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  return (
    <AppLayout>
      <div className="p-6">
        <CourseEditor />
      </div>
    </AppLayout>
  );
}
