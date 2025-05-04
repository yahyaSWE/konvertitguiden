import { Link } from "wouter";
import { Enrollment } from "@shared/schema";

interface CourseCardProps {
  enrollment: Enrollment & { course?: any };
}

export function CourseCard({ enrollment }: CourseCardProps) {
  // Check if course exists in the enrollment
  if (!enrollment.course) {
    return (
      <div className="course-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Course information unavailable</p>
          <Link 
            href="/courses" 
            className="text-primary text-sm font-medium mt-2 inline-block hover:underline"
          >
            Browse courses
          </Link>
        </div>
      </div>
    );
  }
  
  const course = enrollment.course;
  const defaultImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80";
  
  return (
    <div className="course-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="relative h-36 bg-gray-100">
        <img 
          src={course?.imageUrl || defaultImage} 
          alt={course?.title || "Course"} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-sm font-medium bg-primary/80 px-2 py-1 rounded">{course?.category || "Course"}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-poppins font-semibold text-lg text-textColor">{course?.title || "Unavailable Course"}</h3>
          <span className="ml-2 flex-shrink-0 bg-secondary/10 text-secondary text-xs font-medium px-2 py-1 rounded">
            {enrollment.progress}% Complete
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course?.description || "No description available"}</p>
        <div className="mb-4">
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${enrollment.progress}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {course?.author?.fullName?.charAt(0) || "I"}
            </div>
            <span className="text-sm text-gray-600 ml-2">{course?.author?.fullName || "Instructor"}</span>
          </div>
          <Link 
            href={course?.id ? `/courses/${course.id}` : "/courses"} 
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
