import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { CourseDetails as CourseDetailsComponent } from "@/components/courses/course-details";

interface CourseDetailsProps {
  params: {
    id: string;
  };
}

export default function CourseDetails({ params }: CourseDetailsProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const courseId = params.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <AppLayout>
      <div className="p-6">
        <CourseDetailsComponent courseId={courseId} />
      </div>
    </AppLayout>
  );
}
