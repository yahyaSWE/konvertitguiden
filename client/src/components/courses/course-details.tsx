import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { 
  Calendar, 
  Users, 
  Clock, 
  Award, 
  Loader2,
  BarChart,
  BookOpen,
  Edit,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { UserRole } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface CourseDetailsProps {
  courseId: string;
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/enrollments", { courseId: parseInt(courseId) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments/me'] });
      toast({
        title: "Enrollment successful",
        description: "You are now enrolled in this course",
        variant: "success"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "Could not enroll in this course",
        variant: "destructive"
      });
    }
  });

  const toggleModule = (moduleId: string) => {
    if (expandedModuleId === moduleId) {
      setExpandedModuleId(null);
    } else {
      setExpandedModuleId(moduleId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
      </div>
    );
  }

  const isAuthor = user?.id === course.author?.id;
  const isAdmin = user?.role === UserRole.ADMIN;
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Snabbåtgärdsfält */}
      {course.isEnrolled && (
        <div className="bg-primary/10 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-primary">Redo att fortsätta lära dig?</h3>
            <p className="text-sm text-gray-600">Du har slutfört {course.progress}% av denna kurs</p>
          </div>
          <Button 
            size="lg"
            onClick={() => {
              const firstModule = course.modules?.[0];
              const firstLesson = firstModule?.lessons?.[0];
              if (firstLesson) {
                navigate(`/lessons/${firstLesson.id}`);
              }
            }}
          >
            Fortsätt lära dig
          </Button>
        </div>
      )}

      {/* Kursrubrik */}
      <div className="relative mb-6">
        <div className="h-60 w-full rounded-xl overflow-hidden">
          <img 
            src={course.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500&q=80"} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <Badge className="mb-2 bg-primary">{course.category}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-sm text-white/90 max-w-3xl">{course.description}</p>
            </div>
            {canEdit && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="rounded-full"
                onClick={() => navigate(`/courses/${course.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Redigera kurs
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Kursinformation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Skapad</h3>
          </div>
          <p className="text-gray-600">{formatDate(course.createdAt)}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Lärare</h3>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {course.author?.fullName?.charAt(0) || "L"}
            </div>
            <p className="text-gray-600 ml-2">{course.author?.fullName}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Längd</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">{course.duration} veckor</p>
              <p className="text-sm text-gray-500">Uppskattad tid</p>
            </div>
            <div>
              <p className="text-gray-600">{course.level}</p>
              <p className="text-sm text-gray-500">Svårighetsgrad</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kursinnehåll */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Kursinnehåll</h2>
              <p className="text-gray-600 text-sm mt-1">
                {course.modules?.length || 0} moduler • {course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0} lektioner
              </p>
            </div>
            {course.modules && course.modules.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {course.modules.map((module) => (
                  <div key={module.id} className="px-6 py-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleModule(module.id.toString())}
                    >
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        {module.description && (
                          <p className="text-sm text-gray-500">{module.description}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{module.lessons?.length || 0} lektioner</span>
                        {expandedModuleId === module.id.toString() ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedModuleId === module.id.toString() && module.lessons && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">{lesson.duration} min</span>
                              {course.isEnrolled ? (
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/lessons/${lesson.id}`}>Visa</Link>
                                </Button>
                              ) : (
                                <Badge variant="outline">Låst</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">Inget innehåll tillgängligt för denna kurs ännu.</p>
              </div>
            )}
          </div>
        </div>

        {/* Kursåtgärder */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Kursutveckling</h3>
            </div>
            
            {course.isEnrolled ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Slutfört</span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-value" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Poäng att tjäna</span>
                    <span className="text-sm font-medium">{course.points}</span>
                  </div>
                </div>
                
                {course.completed ? (
                  <div className="text-center mt-4">
                    <Badge variant="success" className="mb-2">Slutförd</Badge>
                    <Button 
                      className="w-full mt-2" 
                      variant="outline"
                      onClick={() => navigate(`/certificates/${course.id}`)}
                    >
                      Visa Certifikat
                    </Button>
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <Badge variant="outline" className="mb-2">{course.progress > 0 ? "Pågående" : "Precis börjat"}</Badge>
                    <p className="text-xs text-gray-500 mt-2">Fortsätt din inlärningsresa med knappen högst upp</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-semibold">{course.points}</span>
                    <span className="text-gray-500 ml-1">poäng</span>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => enrollMutation.mutate()}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registrerar...
                    </>
                  ) : (
                    "Registrera dig nu"
                  )}
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  Registrera dig för att spåra framsteg och tjäna poäng
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <BarChart className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Kursstatistik</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registrerade studenter</span>
                <span className="text-sm font-medium">128</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Slutförandegrad</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Genomsnittligt betyg</span>
                <span className="text-sm font-medium">4.7/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
