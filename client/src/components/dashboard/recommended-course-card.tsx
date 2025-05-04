import { Link } from "wouter";
import { Course } from "@shared/schema";
import { Clock, Zap } from "lucide-react";

interface RecommendedCourseCardProps {
  course: Course & {
    author?: {
      id: number;
      fullName: string;
      username: string;
    };
  };
}

export function RecommendedCourseCard({ course }: RecommendedCourseCardProps) {
  const difficultyIcon = () => {
    switch (course.level) {
      case "Beginner":
        return <Zap className="h-4 w-4 mr-1 text-gray-400" />;
      case "Intermediate":
        return <Zap className="h-4 w-4 mr-1 text-gray-400" />;
      case "Advanced":
        return <Zap className="h-4 w-4 mr-1 text-gray-400" />;
      default:
        return <Zap className="h-4 w-4 mr-1 text-gray-400" />;
    }
  };

  return (
    <div className="course-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="relative h-32 bg-gray-100">
        <img 
          src={course.imageUrl || "https://images.unsplash.com/photo-1557264322-b44d383a2906?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80"} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-2 left-2 text-white">
          <span className="text-xs font-medium bg-primary/80 px-2 py-0.5 rounded">{course.category}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-base text-textColor mb-2">{course.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {course.duration} weeks
          </span>
          <span className="flex items-center">
            {difficultyIcon()}
            {course.level}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs">
              {course.author?.fullName?.charAt(0) || "I"}
            </div>
            <span className="text-xs text-gray-600 ml-2">{course.author?.fullName || "Instructor"}</span>
          </div>
          <span className="text-accent font-medium text-sm">{course.points} pts</span>
        </div>
      </div>
    </div>
  );
}
