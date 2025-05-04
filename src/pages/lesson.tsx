import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { LessonContent } from "@/components/courses/lesson-content";

interface LessonProps {
  params: {
    id: string;
  };
}

export default function Lesson({ params }: LessonProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const lessonId = params.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <AppLayout>
      <div className="p-6">
        <LessonContent lessonId={lessonId} />
      </div>
    </AppLayout>
  );
}
