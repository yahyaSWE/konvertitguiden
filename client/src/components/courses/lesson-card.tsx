import { Link } from "wouter";
import { BookOpen, Video, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    type: string;
    duration: number;
    order: number;
  };
  moduleTitle: string;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
}

export function LessonCard({ 
  lesson, 
  moduleTitle, 
  isCompleted, 
  isActive,
  isLocked 
}: LessonCardProps) {
  const { id, title, type, duration } = lesson;

  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      case 'quiz':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-all",
      isActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
      isCompleted ? "border-green-200 bg-green-50" : ""
    )}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">{moduleTitle}</p>
          <h3 className="font-medium flex items-center">
            {getIcon()}
            {title}
          </h3>
        </div>
        {isCompleted && (
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {duration} min
        </div>
        
        {isLocked ? (
          <Button variant="outline" size="sm" disabled>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            Locked
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant={isCompleted ? "outline" : "default"}
            asChild
          >
            <Link href={`/lessons/${id}`}>
              {isCompleted ? "Review" : "Start"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
