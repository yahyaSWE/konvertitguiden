// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  courses;
  modules;
  lessons;
  enrollments;
  progresses;
  achievements;
  userAchievements;
  certificates;
  userCurrentId;
  courseCurrentId;
  moduleCurrentId;
  lessonCurrentId;
  enrollmentCurrentId;
  progressCurrentId;
  achievementCurrentId;
  userAchievementCurrentId;
  certificateCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.courses = /* @__PURE__ */ new Map();
    this.modules = /* @__PURE__ */ new Map();
    this.lessons = /* @__PURE__ */ new Map();
    this.enrollments = /* @__PURE__ */ new Map();
    this.progresses = /* @__PURE__ */ new Map();
    this.achievements = /* @__PURE__ */ new Map();
    this.userAchievements = /* @__PURE__ */ new Map();
    this.certificates = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.moduleCurrentId = 1;
    this.lessonCurrentId = 1;
    this.enrollmentCurrentId = 1;
    this.progressCurrentId = 1;
    this.achievementCurrentId = 1;
    this.userAchievementCurrentId = 1;
    this.certificateCurrentId = 1;
    this.initializeData();
  }
  initializeData() {
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@learnsmart.com",
      fullName: "Admin User",
      role: "admin"
    });
    this.createUser({
      username: "teacher",
      password: "teacher123",
      email: "teacher@learnsmart.com",
      fullName: "Teacher User",
      role: "teacher"
    });
    this.createUser({
      username: "student",
      password: "student123",
      email: "student@learnsmart.com",
      fullName: "Alex Johnson",
      role: "student"
    });
    const webDevCourse = this.createCourse({
      title: "Modern JavaScript Fundamentals",
      description: "Master the essential concepts of JavaScript with practical examples and real-world applications.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80",
      category: "Web Development",
      level: "Beginner",
      duration: 8,
      authorId: 2,
      points: 350
    });
    const pythonCourse = this.createCourse({
      title: "Python for Data Analysis",
      description: "Learn how to analyze and visualize data using Python's powerful libraries like Pandas and Matplotlib.",
      imageUrl: "https://images.unsplash.com/photo-1581093199663-68c6a521388d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80",
      category: "Data Science",
      level: "Intermediate",
      duration: 10,
      authorId: 2,
      points: 450
    });
    const uxCourse = this.createCourse({
      title: "UI/UX Design Principles",
      description: "Discover the fundamentals of creating user-centered designs that engage and delight your audience.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80",
      category: "UX Design",
      level: "Beginner",
      duration: 6,
      authorId: 2,
      points: 300
    });
    const jsModule1 = this.createModule({
      courseId: webDevCourse.id,
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript programming",
      order: 1
    });
    const jsModule2 = this.createModule({
      courseId: webDevCourse.id,
      title: "Working with DOM",
      description: "Manipulate HTML elements using JavaScript",
      order: 2
    });
    this.createLesson({
      moduleId: jsModule1.id,
      title: "Introduction to JavaScript",
      content: "JavaScript is a programming language that runs in the browser...",
      type: "text",
      duration: 15,
      order: 1,
      points: 10
    });
    this.createLesson({
      moduleId: jsModule1.id,
      title: "Variables and Data Types",
      content: "Learn about variables, constants, and data types in JavaScript...",
      type: "text",
      duration: 20,
      order: 2,
      points: 15
    });
    const pyModule1 = this.createModule({
      courseId: pythonCourse.id,
      title: "Python Basics",
      description: "Introduction to Python programming language",
      order: 1
    });
    this.createLesson({
      moduleId: pyModule1.id,
      title: "Getting Started with Python",
      content: "Python is a versatile programming language...",
      type: "text",
      duration: 25,
      order: 1,
      points: 20
    });
    this.createAchievement({
      title: "First Course Completed",
      description: "Complete your first course",
      imageUrl: "course-complete-badge.svg",
      criteria: { type: "course_completion", count: 1 },
      points: 50
    });
    this.createAchievement({
      title: "5-Day Streak",
      description: "Log in for 5 consecutive days",
      imageUrl: "streak-badge.svg",
      criteria: { type: "login_streak", days: 5 },
      points: 25
    });
    this.createAchievement({
      title: "Quiz Master",
      description: "Score 100% on 5 quizzes",
      imageUrl: "quiz-badge.svg",
      criteria: { type: "quiz_completion", score: 100, count: 5 },
      points: 75
    });
    this.createEnrollment({
      userId: 3,
      courseId: webDevCourse.id
    });
    this.createEnrollment({
      userId: 3,
      courseId: pythonCourse.id
    });
    this.createEnrollment({
      userId: 3,
      courseId: uxCourse.id
    });
    const enrollment1 = this.getEnrollment(3, webDevCourse.id);
    if (enrollment1) {
      this.updateEnrollment(enrollment1.id, { progress: 68 });
    }
    const enrollment2 = this.getEnrollment(3, pythonCourse.id);
    if (enrollment2) {
      this.updateEnrollment(enrollment2.id, { progress: 42 });
    }
    const enrollment3 = this.getEnrollment(3, uxCourse.id);
    if (enrollment3) {
      this.updateEnrollment(enrollment3.id, { progress: 18 });
    }
    this.createUserAchievement({
      userId: 3,
      achievementId: 1
    });
    this.createUserAchievement({
      userId: 3,
      achievementId: 2
    });
    this.updateUser(3, { points: 1248, streak: 5 });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  async createUser(user) {
    const id = this.userCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const newUser = {
      ...user,
      id,
      points: 0,
      streak: 0,
      lastLogin: now,
      createdAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  // Course methods
  async getCourse(id) {
    return this.courses.get(id);
  }
  async getAllCourses() {
    return Array.from(this.courses.values());
  }
  async getCoursesByAuthor(authorId) {
    return Array.from(this.courses.values()).filter(
      (course) => course.authorId === authorId
    );
  }
  async createCourse(course) {
    const id = this.courseCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const newCourse = {
      ...course,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.courses.set(id, newCourse);
    return newCourse;
  }
  async updateCourse(id, courseData) {
    const course = this.courses.get(id);
    if (!course) return void 0;
    const updatedCourse = { ...course, ...courseData, updatedAt: /* @__PURE__ */ new Date() };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }
  async deleteCourse(id) {
    return this.courses.delete(id);
  }
  // Module methods
  async getModule(id) {
    return this.modules.get(id);
  }
  async getModulesByCourse(courseId) {
    return Array.from(this.modules.values()).filter((module) => module.courseId === courseId).sort((a, b) => a.order - b.order);
  }
  async createModule(module) {
    const id = this.moduleCurrentId++;
    const newModule = { ...module, id };
    this.modules.set(id, newModule);
    return newModule;
  }
  async updateModule(id, moduleData) {
    const module = this.modules.get(id);
    if (!module) return void 0;
    const updatedModule = { ...module, ...moduleData };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }
  async deleteModule(id) {
    return this.modules.delete(id);
  }
  // Lesson methods
  async getLesson(id) {
    return this.lessons.get(id);
  }
  async getLessonsByModule(moduleId) {
    return Array.from(this.lessons.values()).filter((lesson) => lesson.moduleId === moduleId).sort((a, b) => a.order - b.order);
  }
  async createLesson(lesson) {
    const id = this.lessonCurrentId++;
    const newLesson = { ...lesson, id };
    this.lessons.set(id, newLesson);
    return newLesson;
  }
  async updateLesson(id, lessonData) {
    const lesson = this.lessons.get(id);
    if (!lesson) return void 0;
    const updatedLesson = { ...lesson, ...lessonData };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }
  async deleteLesson(id) {
    return this.lessons.delete(id);
  }
  // Enrollment methods
  async getEnrollment(userId, courseId) {
    return Array.from(this.enrollments.values()).find(
      (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
    );
  }
  async getEnrollmentsByUser(userId) {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );
  }
  async getEnrollmentsByCourse(courseId) {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.courseId === courseId
    );
  }
  async createEnrollment(enrollment) {
    const id = this.enrollmentCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const newEnrollment = {
      ...enrollment,
      id,
      progress: 0,
      completed: false,
      certificateIssued: false,
      enrolledAt: now,
      completedAt: null
    };
    this.enrollments.set(id, newEnrollment);
    return newEnrollment;
  }
  async updateEnrollment(id, enrollmentData) {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return void 0;
    const updatedEnrollment = { ...enrollment, ...enrollmentData };
    if (enrollmentData.completed && !enrollment.completed) {
      updatedEnrollment.completedAt = /* @__PURE__ */ new Date();
    }
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }
  async deleteEnrollment(id) {
    return this.enrollments.delete(id);
  }
  // Progress methods
  async getProgressByUserAndLesson(userId, lessonId) {
    return Array.from(this.progresses.values()).find(
      (progress2) => progress2.userId === userId && progress2.lessonId === lessonId
    );
  }
  async getProgressByUser(userId) {
    return Array.from(this.progresses.values()).filter(
      (progress2) => progress2.userId === userId
    );
  }
  async createProgress(progressData) {
    const id = this.progressCurrentId++;
    const newProgress = {
      ...progressData,
      id,
      completed: false,
      completedAt: null
    };
    this.progresses.set(id, newProgress);
    return newProgress;
  }
  async updateProgress(id, progressData) {
    const progress2 = this.progresses.get(id);
    if (!progress2) return void 0;
    const updatedProgress = { ...progress2, ...progressData };
    if (progressData.completed && !progress2.completed) {
      updatedProgress.completedAt = /* @__PURE__ */ new Date();
    }
    this.progresses.set(id, updatedProgress);
    return updatedProgress;
  }
  async deleteProgress(id) {
    return this.progresses.delete(id);
  }
  // Achievement methods
  async getAchievement(id) {
    return this.achievements.get(id);
  }
  async getAllAchievements() {
    return Array.from(this.achievements.values());
  }
  async createAchievement(achievement) {
    const id = this.achievementCurrentId++;
    const newAchievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  async updateAchievement(id, achievementData) {
    const achievement = this.achievements.get(id);
    if (!achievement) return void 0;
    const updatedAchievement = { ...achievement, ...achievementData };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }
  async deleteAchievement(id) {
    return this.achievements.delete(id);
  }
  // User Achievement methods
  async getUserAchievement(userId, achievementId) {
    return Array.from(this.userAchievements.values()).find(
      (ua) => ua.userId === userId && ua.achievementId === achievementId
    );
  }
  async getUserAchievementsByUser(userId) {
    return Array.from(this.userAchievements.values()).filter(
      (ua) => ua.userId === userId
    );
  }
  async createUserAchievement(userAchievement) {
    const id = this.userAchievementCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const newUserAchievement = {
      ...userAchievement,
      id,
      unlockedAt: now
    };
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }
  async deleteUserAchievement(id) {
    return this.userAchievements.delete(id);
  }
  // Certificate methods
  async getCertificate(userId, courseId) {
    return Array.from(this.certificates.values()).find(
      (cert) => cert.userId === userId && cert.courseId === courseId
    );
  }
  async getCertificatesByUser(userId) {
    return Array.from(this.certificates.values()).filter(
      (cert) => cert.userId === userId
    );
  }
  async createCertificate(certificate) {
    const id = this.certificateCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const newCertificate = {
      ...certificate,
      id,
      issuedAt: now
    };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }
};
var storage = new MemStorage();

// server/routes.ts
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var UserRole = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin"
};
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default(UserRole.STUDENT),
  avatarUrl: text("avatar_url"),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow()
});
var courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  level: text("level").notNull(),
  duration: integer("duration").notNull(),
  // in weeks
  authorId: integer("author_id").notNull(),
  // references users.id
  points: integer("points").notNull().default(0),
  // points earned for completion
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});
var modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  // references courses.id
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull()
});
var lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  // references modules.id
  title: text("title").notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url"),
  // URL to YouTube or similar video platform
  type: text("type").notNull(),
  // video, text, quiz, etc.
  duration: integer("duration"),
  // in minutes
  order: integer("order").notNull(),
  points: integer("points").notNull().default(0)
  // points earned for completion
});
var enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // references users.id
  courseId: integer("course_id").notNull(),
  // references courses.id
  progress: integer("progress").notNull().default(0),
  // percentage
  completed: boolean("completed").notNull().default(false),
  certificateIssued: boolean("certificate_issued").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // references users.id
  lessonId: integer("lesson_id").notNull(),
  // references lessons.id
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at")
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  criteria: json("criteria").notNull(),
  // JSON object with criteria for unlocking
  points: integer("points").notNull().default(0)
});
var userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // references users.id
  achievementId: integer("achievement_id").notNull(),
  // references achievements.id
  unlockedAt: timestamp("unlocked_at").defaultNow()
});
var certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // references users.id
  courseId: integer("course_id").notNull(),
  // references courses.id
  certificateUrl: text("certificate_url"),
  issuedAt: timestamp("issued_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  streak: true,
  lastLogin: true,
  createdAt: true
});
var insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertModuleSchema = createInsertSchema(modules).omit({
  id: true
});
var insertLessonSchema = createInsertSchema(lessons).omit({
  id: true
});
var insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  progress: true,
  completed: true,
  certificateIssued: true,
  enrolledAt: true,
  completedAt: true
});
var insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  completed: true,
  completedAt: true
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true
});
var insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true
});
var insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true
});

// server/routes.ts
var SessionStore = MemoryStore(session);
async function registerRoutes(app2) {
  app2.use(
    session({
      secret: "learnsmart-lms-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 864e5 },
      // 24 hours
      store: new SessionStore({
        checkPeriod: 864e5
        // 24 hours
      })
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
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
        await storage.updateUser(user.id, { lastLogin: /* @__PURE__ */ new Date() });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  const isTeacher = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role === UserRole.TEACHER || req.user.role === UserRole.ADMIN)) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };
  const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === UserRole.ADMIN) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };
  app2.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err2) => {
        if (err2) {
          return next(err2);
        }
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          points: user.points,
          streak: user.streak
        });
      });
    })(req, res, next);
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const newUser = await storage.createUser(userData);
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
          streak: newUser.streak
        });
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/me", isAuthenticated, (req, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      points: user.points,
      streak: user.streak
    });
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const courses2 = await storage.getAllCourses();
      const coursesWithAuthors = await Promise.all(
        courses2.map(async (course) => {
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
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const author = await storage.getUser(course.authorId);
      const modules2 = await storage.getModulesByCourse(courseId);
      const modulesWithLessons = await Promise.all(
        modules2.map(async (module) => {
          const lessons2 = await storage.getLessonsByModule(module.id);
          return {
            ...module,
            lessons: lessons2
          };
        })
      );
      let enrollment = null;
      if (req.isAuthenticated()) {
        enrollment = await storage.getEnrollment(req.user.id, courseId);
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
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/courses", isTeacher, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse({
        ...req.body,
        authorId: req.user.id
      });
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.put("/api/courses/:id", isTeacher, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to update this course" });
      }
      const updatedCourse = await storage.updateCourse(courseId, req.body);
      res.json(updatedCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.delete("/api/courses/:id", isTeacher, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to delete this course" });
      }
      await storage.deleteCourse(courseId);
      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/modules", isTeacher, async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const course = await storage.getCourse(moduleData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to add modules to this course" });
      }
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.put("/api/modules/:id", isTeacher, async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to update this module" });
      }
      const updatedModule = await storage.updateModule(moduleId, req.body);
      res.json(updatedModule);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.delete("/api/modules/:id", isTeacher, async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to delete this module" });
      }
      await storage.deleteModule(moduleId);
      res.json({ message: "Module deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/lessons", isTeacher, async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const module = await storage.getModule(lessonData.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to add lessons to this module" });
      }
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.put("/api/lessons/:id", isTeacher, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to update this lesson" });
      }
      const updatedLesson = await storage.updateLesson(lessonId, req.body);
      res.json(updatedLesson);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.delete("/api/lessons/:id", isTeacher, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.authorId !== req.user.id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Not authorized to delete this lesson" });
      }
      await storage.deleteLesson(lessonId);
      res.json({ message: "Lesson deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/enrollments", isAuthenticated, async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const course = await storage.getCourse(enrollmentData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const existingEnrollment = await storage.getEnrollment(
        enrollmentData.userId,
        enrollmentData.courseId
      );
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.get("/api/enrollments/me", isAuthenticated, async (req, res) => {
    try {
      const enrollments2 = await storage.getEnrollmentsByUser(req.user.id);
      const enrollmentsWithCourses = await Promise.all(
        enrollments2.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return {
            ...enrollment,
            course
          };
        })
      );
      res.json(enrollmentsWithCourses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/enrollments/course/:courseId", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const enrollment = await storage.getEnrollment(req.user.id, courseId);
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const lesson = await storage.getLesson(progressData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      const existingProgress = await storage.getProgressByUserAndLesson(
        progressData.userId,
        progressData.lessonId
      );
      if (existingProgress) {
        const updatedProgress = await storage.updateProgress(existingProgress.id, {
          completed: true,
          completedAt: /* @__PURE__ */ new Date()
        });
        const user2 = await storage.getUser(progressData.userId);
        if (user2) {
          await storage.updateUser(user2.id, {
            points: (user2.points || 0) + (lesson.points || 0)
          });
        }
        await updateCourseProgress(progressData.userId, lesson);
        return res.json(updatedProgress);
      }
      const progress2 = await storage.createProgress(progressData);
      const completedProgress = await storage.updateProgress(progress2.id, {
        completed: true,
        completedAt: /* @__PURE__ */ new Date()
      });
      const user = await storage.getUser(progressData.userId);
      if (user) {
        await storage.updateUser(user.id, {
          points: (user.points || 0) + (lesson.points || 0)
        });
      }
      await updateCourseProgress(progressData.userId, lesson);
      res.status(201).json(completedProgress);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.get("/api/progress/lesson/:lessonId", isAuthenticated, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const progress2 = await storage.getProgressByUserAndLesson(req.user.id, lessonId);
      if (!progress2) {
        return res.json({ completed: false });
      }
      res.json({ completed: progress2.completed });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/achievements", async (req, res) => {
    try {
      const achievements2 = await storage.getAllAchievements();
      res.json(achievements2);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/achievements/me", isAuthenticated, async (req, res) => {
    try {
      const userAchievements2 = await storage.getUserAchievementsByUser(req.user.id);
      const userAchievementsWithDetails = await Promise.all(
        userAchievements2.map(async (ua) => {
          const achievement = await storage.getAchievement(ua.achievementId);
          return {
            ...ua,
            achievement
          };
        })
      );
      res.json(userAchievementsWithDetails);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/certificates/:courseId", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.id;
      const enrollment = await storage.getEnrollment(userId, courseId);
      if (!enrollment || !enrollment.completed) {
        return res.status(400).json({ message: "Course not completed yet" });
      }
      const existingCertificate = await storage.getCertificate(userId, courseId);
      if (existingCertificate) {
        return res.json(existingCertificate);
      }
      const user = await storage.getUser(userId);
      const course = await storage.getCourse(courseId);
      const certificateUrl = await createPDFCertificate(user, course);
      const certificate = await storage.createCertificate({
        userId,
        courseId,
        certificateUrl
      });
      await storage.updateEnrollment(enrollment.id, { certificateIssued: true });
      res.status(201).json(certificate);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/certificates/me", isAuthenticated, async (req, res) => {
    try {
      const certificates2 = await storage.getCertificatesByUser(req.user.id);
      const certificatesWithCourses = await Promise.all(
        certificates2.map(async (cert) => {
          const course = await storage.getCourse(cert.courseId);
          return {
            ...cert,
            course
          };
        })
      );
      res.json(certificatesWithCourses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.put("/api/admin/users/:id", isAdmin, async (req, res) => {
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
        streak: updatedUser?.streak
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  async function updateCourseProgress(userId, lesson) {
    try {
      const module = await storage.getModule(lesson.moduleId);
      if (!module) return;
      const course = await storage.getCourse(module.courseId);
      if (!course) return;
      const enrollment = await storage.getEnrollment(userId, course.id);
      if (!enrollment) return;
      const modules2 = await storage.getModulesByCourse(course.id);
      let totalLessons = 0;
      let completedLessons = 0;
      for (const mod of modules2) {
        const lessons2 = await storage.getLessonsByModule(mod.id);
        totalLessons += lessons2.length;
        for (const les of lessons2) {
          const progress2 = await storage.getProgressByUserAndLesson(userId, les.id);
          if (progress2 && progress2.completed) {
            completedLessons++;
          }
        }
      }
      const progressPercentage = totalLessons > 0 ? Math.round(completedLessons / totalLessons * 100) : 0;
      const updatedEnrollment = await storage.updateEnrollment(enrollment.id, {
        progress: progressPercentage
      });
      if (progressPercentage === 100 && !enrollment.completed) {
        await storage.updateEnrollment(enrollment.id, {
          completed: true,
          completedAt: /* @__PURE__ */ new Date()
        });
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(user.id, {
            points: (user.points || 0) + (course.points || 0)
          });
        }
        const firstCourseAchievement = (await storage.getAllAchievements()).find((a) => a.title === "First Course Completed");
        if (firstCourseAchievement) {
          const userHasAchievement = await storage.getUserAchievement(
            userId,
            firstCourseAchievement.id
          );
          if (!userHasAchievement) {
            await storage.createUserAchievement({
              userId,
              achievementId: firstCourseAchievement.id
            });
            const user2 = await storage.getUser(userId);
            if (user2) {
              await storage.updateUser(user2.id, {
                points: (user2.points || 0) + (firstCourseAchievement.points || 0)
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating course progress:", error);
    }
  }
  const httpServer = createServer(app2);
  return httpServer;
}
function createPDFCertificate(user, course) {
  return Promise.resolve(`certificate-${user.id}-${course.id}.pdf`);
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
