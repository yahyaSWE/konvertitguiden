import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { AchievementsShowcase } from "@/components/dashboard/achievements-showcase";
import { CourseCard } from "@/components/dashboard/course-card";
import { RecommendedCourseCard } from "@/components/dashboard/recommended-course-card";
import { LearningActivity } from "@/components/dashboard/learning-activity";
import { QuickStartView } from "@/components/dashboard/quick-start-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("quickstart");

  // Omdirigera till inloggning om inte autentiserad
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    
    // Omdirigera administratör till admin-dashboard
    if (!isLoading && user && user.role === UserRole.ADMIN) {
      navigate("/admin/dashboard");
    }
  }, [user, isLoading, navigate]);

  // Fetch user enrollments
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/enrollments/me'],
    enabled: !!user
  });

  // Fetch recommended courses
  const { data: allCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: !!user
  });

  // Filter out already enrolled courses for recommendations
  const recommendedCourses = allCourses?.filter(course => 
    !enrollments?.some(enrollment => enrollment.courseId === course.id)
  )?.slice(0, 4);

  // Sort in-progress courses by last accessed
  const inProgressCourses = enrollments?.filter(enrollment => !enrollment.completed)
    ?.sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-textColor">Din lärandeöversikt</h1>
            <p className="text-gray-600">Välkommen tillbaka, {user?.fullName || ""}!</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex justify-end">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="quickstart">Snabbstart</TabsTrigger>
              <TabsTrigger value="detailed">Detaljerad vy</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="quickstart" className="mt-0">
            {/* Quick Start View */}
            <QuickStartView />
            
            {/* Only show essential sections in quick start view */}
            <AchievementsShowcase />
            
            {/* Rekommenderade kurser - förenklad version */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-poppins font-semibold text-textColor">Rekommenderat för dig</h2>
                <a href="/courses" className="text-primary text-sm font-medium hover:underline">Visa alla</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!coursesLoading && recommendedCourses?.length === 0 && (
                  <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="text-gray-600">Inga rekommendationer tillgängliga</p>
                  </div>
                )}
                
                {recommendedCourses?.slice(0, 3).map((course) => (
                  <RecommendedCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-0">
            {/* Stats Overview */}
            <DashboardStats />

            {/* Recent Achievements */}
            <AchievementsShowcase />
            
            {/* Kurser under genomförande */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-poppins font-semibold text-textColor">Fortsätt lärandet</h2>
                <a href="/courses" className="text-primary text-sm font-medium hover:underline">Visa alla kurser</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!enrollmentsLoading && inProgressCourses?.length === 0 && (
                  <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-600 mb-2">Du har inga pågående kurser</p>
                    <a href="/courses" className="text-primary font-medium hover:underline">Bläddra bland kurser för att komma igång</a>
                  </div>
                )}
                
                {inProgressCourses?.slice(0, 3).map((enrollment) => (
                  <CourseCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>

            {/* Lärandeaktivitet */}
            <LearningActivity />
            
            {/* Rekommenderade kurser */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-poppins font-semibold text-textColor">Rekommenderat för dig</h2>
                <a href="/courses" className="text-primary text-sm font-medium hover:underline">Visa alla</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {!coursesLoading && recommendedCourses?.length === 0 && (
                  <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="text-gray-600">Inga rekommendationer tillgängliga</p>
                  </div>
                )}
                
                {recommendedCourses?.map((course) => (
                  <RecommendedCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
