import express, { Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  insertUserSchema,
  insertCourseSchema,
  insertModuleSchema,
  insertLessonSchema,
  insertEnrollmentSchema,
  insertProgressSchema,
  UserRole
} from "@shared/schema";
import { createPDFCertificate } from "./certificate";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      secret: "learnsmart-lms-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000, // 24 hours
      }),
    })
  );

  // Set up passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        // Update last login time
        await storage.updateUser(user.id, { lastLogin: new Date() });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isTeacher = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && ((req.user as any).role === UserRole.TEACHER || (req.user as any).role === UserRole.ADMIN)) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  const isAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && (req.user as any).role === UserRole.ADMIN) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          points: user.points,
          streak: user.streak,
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Auto-login after registration
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        return res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          points: newUser.points,
          streak: newUser.streak,
        });
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      points: user.points,
      streak: user.streak,
    });
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      
      // Get authors for courses
      const coursesWithAuthors = await Promise.all(
        courses.map(async (course) => {
          const author = await storage.getUser(course.authorId);
          return {
            ...course,
            author: author ? {
              id: author.id,
              fullName: author.fullName,
              username: author.username
            } : null
          };
        })
      );
      
      res.json(coursesWithAuthors);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Get course author
      const author = await storage.getUser(course.authorId);
      
      // Get modules for this course
      const modules = await storage.getModulesByCourse(courseId);
      
      // Get lessons for each module
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await storage.getLessonsByModule(module.id);
          return {
            ...module,
            lessons
          };
        })
      );
      
      // Check if the user is enrolled in this course
      let enrollment = null;
      if (req.isAuthenticated()) {
        enrollment = await storage.getEnrollment((req.user as any).id, courseId);
      }
      
      res.json({
        ...course,
        author: author ? {
          id: author.id,
          fullName: author.fullName,
          username: author.username
        } : null,
        modules: modulesWithLessons,
        isEnrolled: !!enrollment,
        progress: enrollment?.progress || 0,
        completed: enrollment?.completed || false
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/courses", isTeacher, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse({
        ...req.body,
        authorId: (req.user as any).id
      });
      
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put("/api/courses/:id", isTeacher, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Only the author or admin can update the course
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to update this course" });
      }
      
      const updatedCourse = await storage.updateCourse(courseId, req.body);
      res.json(updatedCourse);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/api/courses/:id", isTeacher, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Only the author or admin can delete the course
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to delete this course" });
      }
      
      await storage.deleteCourse(courseId);
      res.json({ message: "Course deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Module routes
  app.post("/api/modules", isTeacher, async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      
      // Check if the course exists and the user is the author
      const course = await storage.getCourse(moduleData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to add modules to this course" });
      }
      
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put("/api/modules/:id", isTeacher, async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Check if the user is the course author
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to update this module" });
      }
      
      const updatedModule = await storage.updateModule(moduleId, req.body);
      res.json(updatedModule);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/api/modules/:id", isTeacher, async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Check if the user is the course author
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to delete this module" });
      }
      
      await storage.deleteModule(moduleId);
      res.json({ message: "Module deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Lesson routes
  app.post("/api/lessons", isTeacher, async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      
      // Check if the module exists and the user is the course author
      const module = await storage.getModule(lessonData.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to add lessons to this module" });
      }
      
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put("/api/lessons/:id", isTeacher, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      // Check if the user is the course author
      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to update this lesson" });
      }
      
      const updatedLesson = await storage.updateLesson(lessonId, req.body);
      res.json(updatedLesson);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/api/lessons/:id", isTeacher, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      // Check if the user is the course author
      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.authorId !== (req.user as any).id && (req.user as any).role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to delete this lesson" });
      }
      
      await storage.deleteLesson(lessonId);
      res.json({ message: "Lesson deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", isAuthenticated, async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        userId: (req.user as any).id
      });
      
      // Check if the course exists
      const course = await storage.getCourse(enrollmentData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(
        enrollmentData.userId,
        enrollmentData.courseId
      );
      
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get("/api/enrollments/me", isAuthenticated, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByUser((req.user as any).id);
      
      // Get course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return {
            ...enrollment,
            course
          };
        })
      );
      
      res.json(enrollmentsWithCourses);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/enrollments/course/:courseId", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const enrollment = await storage.getEnrollment((req.user as any).id, courseId);
      
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      
      res.json(enrollment);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Progress routes
  app.post("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse({
        ...req.body,
        userId: (req.user as any).id
      });
      
      // Check if the lesson exists
      const lesson = await storage.getLesson(progressData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      // Check if already exists
      const existingProgress = await storage.getProgressByUserAndLesson(
        progressData.userId,
        progressData.lessonId
      );
      
      if (existingProgress) {
        const updatedProgress = await storage.updateProgress(existingProgress.id, {
          completed: true,
          completedAt: new Date()
        });
        
        // Award points for lesson completion
        const user = await storage.getUser(progressData.userId);
        if (user) {
          await storage.updateUser(user.id, {
            points: (user.points || 0) + (lesson.points || 0)
          });
        }
        
        // Update course progress
        await updateCourseProgress(progressData.userId, lesson);
        
        return res.json(updatedProgress);
      }
      
      const progress = await storage.createProgress(progressData);
      
      // Mark as completed immediately
      const completedProgress = await storage.updateProgress(progress.id, {
        completed: true,
        completedAt: new Date()
      });
      
      // Award points for lesson completion
      const user = await storage.getUser(progressData.userId);
      if (user) {
        await storage.updateUser(user.id, {
          points: (user.points || 0) + (lesson.points || 0)
        });
      }
      
      // Update course progress
      await updateCourseProgress(progressData.userId, lesson);
      
      res.status(201).json(completedProgress);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get("/api/progress/lesson/:lessonId", isAuthenticated, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const progress = await storage.getProgressByUserAndLesson((req.user as any).id, lessonId);
      
      if (!progress) {
        return res.json({ completed: false });
      }
      
      res.json({ completed: progress.completed });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/achievements/me", isAuthenticated, async (req, res) => {
    try {
      const userAchievements = await storage.getUserAchievementsByUser((req.user as any).id);
      
      // Get achievement details for each user achievement
      const userAchievementsWithDetails = await Promise.all(
        userAchievements.map(async (ua) => {
          const achievement = await storage.getAchievement(ua.achievementId);
          return {
            ...ua,
            achievement
          };
        })
      );
      
      res.json(userAchievementsWithDetails);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Certificate routes
  app.post("/api/certificates/:courseId", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = (req.user as any).id;
      
      // Check if the user has completed the course
      const enrollment = await storage.getEnrollment(userId, courseId);
      if (!enrollment || !enrollment.completed) {
        return res.status(400).json({ message: "Course not completed yet" });
      }
      
      // Check if certificate already exists
      const existingCertificate = await storage.getCertificate(userId, courseId);
      if (existingCertificate) {
        return res.json(existingCertificate);
      }
      
      // Generate certificate
      const user = await storage.getUser(userId) as any;
      const course = await storage.getCourse(courseId) as any;
      
      const certificateUrl = await createPDFCertificate(user, course);
      
      // Save certificate
      const certificate = await storage.createCertificate({
        userId,
        courseId,
        certificateUrl
      });
      
      // Update enrollment
      await storage.updateEnrollment(enrollment.id, { certificateIssued: true });
      
      res.status(201).json(certificate);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/certificates/me", isAuthenticated, async (req, res) => {
    try {
      const certificates = await storage.getCertificatesByUser((req.user as any).id);
      
      // Get course details for each certificate
      const certificatesWithCourses = await Promise.all(
        certificates.map(async (cert) => {
          const course = await storage.getCourse(cert.courseId);
          return {
            ...cert,
            course
          };
        })
      );
      
      res.json(certificatesWithCourses);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json({
        id: updatedUser?.id,
        username: updatedUser?.username,
        email: updatedUser?.email,
        fullName: updatedUser?.fullName,
        role: updatedUser?.role,
        points: updatedUser?.points,
        streak: updatedUser?.streak,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // Helper functions
  async function updateCourseProgress(userId: number, lesson: any) {
    try {
      // Get the module for this lesson
      const module = await storage.getModule(lesson.moduleId);
      if (!module) return;
      
      // Get the course for this module
      const course = await storage.getCourse(module.courseId);
      if (!course) return;
      
      // Get the enrollment
      const enrollment = await storage.getEnrollment(userId, course.id);
      if (!enrollment) return;
      
      // Get all lessons for this course
      const modules = await storage.getModulesByCourse(course.id);
      let totalLessons = 0;
      let completedLessons = 0;
      
      for (const mod of modules) {
        const lessons = await storage.getLessonsByModule(mod.id);
        totalLessons += lessons.length;
        
        for (const les of lessons) {
          const progress = await storage.getProgressByUserAndLesson(userId, les.id);
          if (progress && progress.completed) {
            completedLessons++;
          }
        }
      }
      
      // Calculate progress percentage
      const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;
      
      // Update enrollment progress
      const updatedEnrollment = await storage.updateEnrollment(enrollment.id, {
        progress: progressPercentage
      });
      
      // Check if the course is now complete
      if (progressPercentage === 100 && !enrollment.completed) {
        await storage.updateEnrollment(enrollment.id, {
          completed: true,
          completedAt: new Date()
        });
        
        // Award points for course completion
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(user.id, {
            points: (user.points || 0) + (course.points || 0)
          });
        }
        
        // Check if eligible for "First Course Completed" achievement
        const firstCourseAchievement = (await storage.getAllAchievements())
          .find(a => a.title === "First Course Completed");
        
        if (firstCourseAchievement) {
          const userHasAchievement = await storage.getUserAchievement(
            userId,
            firstCourseAchievement.id
          );
          
          if (!userHasAchievement) {
            // Award the achievement
            await storage.createUserAchievement({
              userId,
              achievementId: firstCourseAchievement.id
            });
            
            // Award points for achievement
            const user = await storage.getUser(userId);
            if (user) {
              await storage.updateUser(user.id, {
                points: (user.points || 0) + (firstCourseAchievement.points || 0)
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating course progress:", error);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}

// Certificate generation function (placeholder)
function createPDFCertificate(user: any, course: any): Promise<string> {
  return Promise.resolve(`certificate-${user.id}-${course.id}.pdf`);
}
