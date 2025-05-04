import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Save,
  MoveUp,
  MoveDown,
  Edit,
  X
} from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { insertCourseSchema, insertModuleSchema, insertLessonSchema } from "@shared/schema";

// Enhanced schema with validation for frontend
const courseSchema = insertCourseSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  level: z.string().min(1, "Level is required"),
  duration: z.number().min(1, "Duration must be at least 1 week").max(52, "Duration cannot exceed 52 weeks"),
  points: z.number().min(1, "Points must be at least 1"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const moduleSchema = insertModuleSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  order: z.number().min(1, "Order must be at least 1"),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

const lessonSchema = insertLessonSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  videoUrl: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  order: z.number().min(1, "Order must be at least 1"),
  points: z.number().min(0, "Points cannot be negative"),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface CourseEditorProps {
  courseId?: string;
}

export function CourseEditor({ courseId }: CourseEditorProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!courseId;
  
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'module' | 'lesson'; id: number } | null>(null);

  // Fetch course if in edit mode
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: isEditMode,
  });

  // Course form
  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      level: "Beginner",
      duration: 4,
      points: 100,
    },
  });

  // Module form
  const moduleForm = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: parseInt(courseId || "0"),
      order: 1,
    },
  });

  // Lesson form
  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      type: "text",
      duration: 15,
      moduleId: 0,
      order: 1,
      points: 10,
    },
  });

  // Load course data into form
  useEffect(() => {
    if (courseData) {
      courseForm.reset({
        title: courseData.title,
        description: courseData.description,
        imageUrl: courseData.imageUrl || "",
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration,
        points: courseData.points,
      });
    }
  }, [courseData, courseForm]);

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: (data: CourseFormValues) => {
      return apiRequest("POST", "/api/courses", data);
    },
    onSuccess: async (response) => {
      const newCourse = await response.json();
      toast({
        title: "Course created",
        description: "Your course has been created successfully",
      });
      navigate(`/courses/${newCourse.id}/edit`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (data: CourseFormValues) => {
      return apiRequest("PUT", `/api/courses/${courseId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      toast({
        title: "Course updated",
        description: "Your course has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    },
  });

  const createModuleMutation = useMutation({
    mutationFn: (data: ModuleFormValues) => {
      return apiRequest("POST", "/api/modules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      setModuleDialogOpen(false);
      moduleForm.reset({
        title: "",
        description: "",
        courseId: parseInt(courseId || "0"),
        order: (courseData?.modules?.length || 0) + 1,
      });
      toast({
        title: "Module added",
        description: "The module has been added to your course",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add module",
        variant: "destructive",
      });
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest("PUT", `/api/modules/${data.id}`, {
        title: data.title,
        description: data.description,
        order: data.order,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      setModuleDialogOpen(false);
      setEditingModule(null);
      toast({
        title: "Module updated",
        description: "The module has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update module",
        variant: "destructive",
      });
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (moduleId: number) => {
      return apiRequest("DELETE", `/api/modules/${moduleId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      toast({
        title: "Module deleted",
        description: "The module has been deleted from your course",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete module",
        variant: "destructive",
      });
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: (data: LessonFormValues) => {
      return apiRequest("POST", "/api/lessons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      setLessonDialogOpen(false);
      lessonForm.reset({
        title: "",
        content: "",
        type: "text",
        duration: 15,
        moduleId: 0,
        order: 1,
        points: 10,
      });
      toast({
        title: "Lesson added",
        description: "The lesson has been added to your module",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add lesson",
        variant: "destructive",
      });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest("PUT", `/api/lessons/${data.id}`, {
        title: data.title,
        content: data.content,
        videoUrl: data.videoUrl,
        type: data.type,
        duration: data.duration,
        order: data.order,
        points: data.points,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      setLessonDialogOpen(false);
      setEditingLesson(null);
      toast({
        title: "Lesson updated",
        description: "The lesson has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lesson",
        variant: "destructive",
      });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => {
      return apiRequest("DELETE", `/api/lessons/${lessonId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      toast({
        title: "Lesson deleted",
        description: "The lesson has been deleted from your module",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lesson",
        variant: "destructive",
      });
    },
  });

  // Form submit handlers
  const onCourseSubmit = (data: CourseFormValues) => {
    if (isEditMode) {
      updateCourseMutation.mutate(data);
    } else {
      createCourseMutation.mutate(data);
    }
  };

  const onModuleSubmit = (data: ModuleFormValues) => {
    if (editingModule) {
      updateModuleMutation.mutate({
        ...data,
        id: editingModule.id,
      });
    } else {
      createModuleMutation.mutate({
        ...data,
        courseId: parseInt(courseId || "0"),
      });
    }
  };

  const onLessonSubmit = (data: LessonFormValues) => {
    if (editingLesson) {
      updateLessonMutation.mutate({
        ...data,
        id: editingLesson.id,
      });
    } else {
      createLessonMutation.mutate(data);
    }
  };

  // Helper functions
  const openAddModuleDialog = () => {
    moduleForm.reset({
      title: "",
      description: "",
      courseId: parseInt(courseId || "0"),
      order: (courseData?.modules?.length || 0) + 1,
    });
    setEditingModule(null);
    setModuleDialogOpen(true);
  };

  const openEditModuleDialog = (module: any) => {
    moduleForm.reset({
      title: module.title,
      description: module.description || "",
      courseId: module.courseId,
      order: module.order,
    });
    setEditingModule(module);
    setModuleDialogOpen(true);
  };

  const openAddLessonDialog = (moduleId: number) => {
    const module = courseData?.modules?.find((m: any) => m.id === moduleId);
    const lessonCount = module?.lessons?.length || 0;
    
    lessonForm.reset({
      title: "",
      content: "",
      videoUrl: "",
      type: "text",
      duration: 15,
      moduleId: moduleId,
      order: lessonCount + 1,
      points: 10,
    });
    setEditingLesson(null);
    setLessonDialogOpen(true);
  };

  const openEditLessonDialog = (lesson: any) => {
    lessonForm.reset({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || "",
      type: lesson.type,
      duration: lesson.duration,
      moduleId: lesson.moduleId,
      order: lesson.order,
      points: lesson.points,
    });
    setEditingLesson(lesson);
    setLessonDialogOpen(true);
  };

  const confirmDelete = (type: 'module' | 'lesson', id: number) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'module') {
      deleteModuleMutation.mutate(deleteTarget.id);
    } else {
      deleteLessonMutation.mutate(deleteTarget.id);
    }
  };

  // Loading state
  if (isEditMode && courseLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Course" : "Create New Course"}
        </h1>
        
        {isEditMode && (
          <Button onClick={() => navigate(`/courses/${courseId}`)}>
            View Course
          </Button>
        )}
      </div>

      {/* Course Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Course Details" : "New Course"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update your course details below" : "Fill in the details to create your course"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-6">
              <FormField
                control={courseForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Introduction to Web Development" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive title for your course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what students will learn in this course..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the course content and goals
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={courseForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to an image for your course (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="UX Design">UX Design</SelectItem>
                          <SelectItem value="Mobile Dev">Mobile Development</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={courseForm.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (weeks)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="52" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Reward points for completing the course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={
                    createCourseMutation.isPending || 
                    updateCourseMutation.isPending
                  }
                >
                  {(createCourseMutation.isPending || updateCourseMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditMode ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Course Content */}
      {isEditMode && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Organize your course into modules and lessons
              </CardDescription>
            </div>
            <Button onClick={openAddModuleDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </CardHeader>
          <CardContent>
            {courseData?.modules && courseData.modules.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                value={activeModule}
                onValueChange={setActiveModule}
                className="border rounded-md"
              >
                {courseData.modules.map((module: any) => (
                  <AccordionItem key={module.id} value={module.id.toString()}>
                    <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="text-left">
                          <span className="font-medium">{module.title}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {module.lessons?.length || 0} lessons
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModuleDialog(module);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete('module', module.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 pb-4">
                      <div className="space-y-4">
                        {module.lessons && module.lessons.length > 0 ? (
                          <div className="space-y-2">
                            {module.lessons.map((lesson: any) => (
                              <div 
                                key={lesson.id} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                              >
                                <div>
                                  <div className="font-medium">{lesson.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {lesson.type} • {lesson.duration} min • {lesson.points} points
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditLessonDialog(lesson)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => confirmDelete('lesson', lesson.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No lessons in this module yet
                          </div>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => openAddLessonDialog(module.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Modules Yet</h3>
                <p className="text-gray-500 mb-4">
                  Start building your course by adding modules
                </p>
                <Button onClick={openAddModuleDialog}>
                  Add Your First Module
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingModule ? "Edit Module" : "Add New Module"}
            </DialogTitle>
            <DialogDescription>
              {editingModule 
                ? "Update the details of this module" 
                : "Create a new module for your course"}
            </DialogDescription>
          </DialogHeader>

          <Form {...moduleForm}>
            <form onSubmit={moduleForm.handleSubmit(onModuleSubmit)} className="space-y-4">
              <FormField
                control={moduleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Introduction to JavaScript" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief overview of this module..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      The display order of this module in the course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createModuleMutation.isPending || updateModuleMutation.isPending}
                >
                  {(createModuleMutation.isPending || updateModuleMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingModule ? "Update Module" : "Add Module"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
            <DialogDescription>
              {editingLesson 
                ? "Update the details of this lesson" 
                : "Create a new lesson for your module"}
            </DialogDescription>
          </DialogHeader>

          <Form {...lessonForm}>
            <form onSubmit={lessonForm.handleSubmit(onLessonSubmit)} className="space-y-4">
              <FormField
                control={lessonForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Introduction to Variables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={lessonForm.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. https://www.youtube.com/watch?v=example" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to a YouTube or similar video platform (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={lessonForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={lessonForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={lessonForm.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={lessonForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the lesson content here..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      You can use HTML markup for formatting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={lessonForm.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      The display order of this lesson in the module
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                >
                  {(createLessonMutation.isPending || updateLessonMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingLesson ? "Update Lesson" : "Add Lesson"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteTarget?.type === 'module' 
                ? "Are you sure you want to delete this module? This will also delete all lessons within this module."
                : "Are you sure you want to delete this lesson? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteModuleMutation.isPending || deleteLessonMutation.isPending}
            >
              {(deleteModuleMutation.isPending || deleteLessonMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
