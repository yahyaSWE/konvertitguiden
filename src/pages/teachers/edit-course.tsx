import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { CourseEditor } from "@/components/courses/course-editor";
import { UserRole } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface EditCourseProps {
  params: {
    id: string;
  };
}

export default function EditCourse({ params }: EditCourseProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const courseId = params.id;

  // Fetch course to check ownership
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!user && !!courseId,
  });

  // Check authentication, role, and course ownership
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    if (!isLoading && !courseLoading && course) {
      const isAuthor = user?.id === course.author?.id;
      const isAdmin = user?.role === UserRole.ADMIN;
      
      if (user?.role === UserRole.STUDENT || (!isAuthor && !isAdmin)) {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, course, courseLoading, navigate]);

  // Display loading state while checking permissions
  if (isLoading || courseLoading) {
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
        <CourseEditor courseId={courseId} />
      </div>
    </AppLayout>
  );
}
