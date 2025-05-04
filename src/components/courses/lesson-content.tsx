import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Loader2,
  Check,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Helper function to format video URLs for embedding
function formatVideoUrl(url: string): string {
  if (!url) return '';
  
  // YouTube URL format conversion
  if (url.includes('youtube.com/watch')) {
    // Convert standard YouTube URL to embed format
    const videoId = new URL(url).searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (url.includes('youtu.be/')) {
    // Convert short YouTube URL to embed format
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (url.includes('youtube.com/embed/')) {
    // Already in embed format
    return url;
  } else if (url.includes('vimeo.com/')) {
    // Convert Vimeo URL to embed format
    const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }
  
  // Return original URL if no formatting needed or unsupported format
  return url;
}

interface LessonContentProps {
  lessonId: string;
}

export function LessonContent({ lessonId }: LessonContentProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showCompletionSuccess, setShowCompletionSuccess] = useState(false);

  // Fetch lesson details
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}`],
  });

  // Fetch lesson progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/progress/lesson/${lessonId}`],
  });

  // Fetch module and course data
  const { data: moduleData, isLoading: moduleLoading } = useQuery({
    queryKey: [`/api/modules/${lesson?.moduleId}`],
    enabled: !!lesson?.moduleId,
  });

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${moduleData?.courseId}`],
    enabled: !!moduleData?.courseId,
  });

  // Mutations
  const completeLessonMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/progress", { lessonId: parseInt(lessonId) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/lesson/${lessonId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/enrollments/course/${moduleData?.courseId}`] });
      
      setShowCompletionSuccess(true);
      setTimeout(() => {
        setShowCompletionSuccess(false);
      }, 3000);
      
      toast({
        title: "Lesson completed",
        description: "Your progress has been updated"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark lesson as complete",
        variant: "destructive"
      });
    }
  });

  const isLoading = lessonLoading || progressLoading || moduleLoading || courseLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-500">Loading lesson content...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
        <p className="text-gray-500 mb-6">The lesson you're looking for doesn't exist or has been removed</p>
        <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
      </div>
    );
  }

  // Find next and previous lessons
  const allLessons = courseData?.modules?.flatMap((module: any) => 
    module.lessons?.map((l: any) => ({
      ...l,
      moduleTitle: module.title,
    }))
  ) || [];
  
  const sortedLessons = allLessons.sort((a: any, b: any) => {
    if (a.moduleId !== b.moduleId) {
      return a.moduleId - b.moduleId;
    }
    return a.order - b.order;
  });

  const currentLessonIndex = sortedLessons.findIndex((l: any) => l.id.toString() === lessonId);
  const previousLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : null;

  const module = courseData?.modules?.find((m: any) => m.id === lesson.moduleId);
  const isCompleted = progress?.completed || false;

  const handleComplete = () => {
    if (!isCompleted) {
      completeLessonMutation.mutate();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">{courseData?.title}</p>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>
        
        <div className="flex space-x-2">
          {previousLesson && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/lessons/${previousLesson.id}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </a>
            </Button>
          )}
          
          {nextLesson && (
            <Button size="sm" asChild>
              <a href={`/lessons/${nextLesson.id}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Lesson content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6">
          {lesson.type === 'video' ? (
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              {lesson.videoUrl ? (
                <iframe
                  src={formatVideoUrl(lesson.videoUrl)}
                  className="w-full h-full border-0"
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500">No video URL provided</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
          
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <BookOpen className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium">{module?.title}</p>
            <p className="text-xs text-gray-500">Lesson {lesson.order} of {module?.lessons?.length}</p>
          </div>
        </div>
        
        <div>
          {isCompleted ? (
            <Button variant="outline" disabled className="bg-green-50 text-green-600 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          ) : completeLessonMutation.isPending ? (
            <Button disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Marking as Complete...
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      </div>

      {/* Success notification */}
      {showCompletionSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">Lesson completed!</p>
            <p className="text-sm">+{lesson.points} points earned</p>
          </div>
        </div>
      )}
    </div>
  );
}
