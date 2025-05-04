import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { CourseList } from "@/components/courses/course-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UserRole } from "@shared/schema";

export default function Courses() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Omdirigera till inloggning om inte autentiserad
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-textColor">Kurser</h1>
            <p className="text-gray-600">Bläddra och upptäck utbildningsmöjligheter</p>
          </div>
          
          {/* Visa kursknapp för lärare och administratörer */}
          {user && (user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) && (
            <Button onClick={() => navigate("/courses/create")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Skapa kurs
            </Button>
          )}
        </div>
        
        <CourseList />
      </div>
    </AppLayout>
  );
}
