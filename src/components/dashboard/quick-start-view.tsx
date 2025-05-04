import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Award, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function QuickStartView() {
  const [, navigate] = useLocation();
  
  // Fetch user enrollments
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/enrollments/me'],
  });

  // Get the most recent enrollment (the one the student was last active in)
  const latestEnrollment = enrollments && enrollments.length > 0
    ? [...enrollments].sort((a, b) => 
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
      )[0]
    : null;
    
  const course = latestEnrollment?.course;
  
  // Find the next lesson to continue
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);
  
  useEffect(() => {
    if (course && course.modules && course.modules.length > 0) {
      // Try to find the first incomplete lesson
      let foundNextLesson = false;
      
      for (const module of course.modules) {
        if (!module.lessons || module.lessons.length === 0) continue;
        
        for (const lesson of module.lessons) {
          // Check if this lesson isn't completed
          if (!lesson.completed) {
            setNextLessonId(lesson.id);
            foundNextLesson = true;
            break;
          }
        }
        
        if (foundNextLesson) break;
      }
      
      // If no incomplete lesson was found, just use the first lesson
      if (!foundNextLesson && course.modules[0].lessons && course.modules[0].lessons.length > 0) {
        setNextLessonId(course.modules[0].lessons[0].id);
      }
    }
  }, [course]);
  
  const handleContinueLearning = () => {
    if (nextLessonId) {
      navigate(`/lessons/${nextLessonId}`);
    } else if (course) {
      navigate(`/courses/${course.id}`);
    } else {
      navigate('/courses');
    }
  };
  
  const handleViewAllCourses = () => {
    navigate('/courses');
  };
  
  if (enrollmentsLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-24 w-full mb-3" />
          <Skeleton className="h-8 w-1/3 mb-3" />
          <Skeleton className="h-10 w-1/4" />
        </CardContent>
      </Card>
    );
  }
  
  if (!latestEnrollment || !course) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center py-10 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Redo att börja lära dig?</h3>
            <p className="text-gray-600 mb-6">Du är inte registrerad på några kurser ännu.</p>
            <Button onClick={handleViewAllCourses}>
              Bläddra bland kurser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8 overflow-hidden border-t-4 border-t-primary">
      <CardContent className="p-0">
        <div className="relative">
          <div 
            className="h-40 bg-cover bg-center" 
            style={{ 
              backgroundImage: course.imageUrl ? 
                `url(${course.imageUrl})` : 
                'url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80)' 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center mb-2">
              <span className="bg-primary/90 text-white text-xs font-medium px-2.5 py-1 rounded">{course.category}</span>
              <span className="mx-2">•</span>
              <span className="text-sm flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {course.duration} timmar</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{course.title}</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Din framsteg</span>
              <span className="text-sm font-medium text-primary">{latestEnrollment.progress}%</span>
            </div>
            <Progress value={latestEnrollment.progress} className="h-2" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Senaste aktivitet: {formatDate(latestEnrollment.enrolledAt)}</p>
              <p className="text-sm flex items-center">
                <Award className="h-4 w-4 mr-1 text-yellow-500" /> 
                {course.points} poäng vid slutförande
              </p>
            </div>
            
            <Button 
              size="lg" 
              onClick={handleContinueLearning}
              className="w-full sm:w-auto"
            >
              Fortsätt lära dig
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}