import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const UserRole = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Users table
export const users = pgTable("users", {
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
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  level: text("level").notNull(),
  duration: integer("duration").notNull(), // in weeks
  authorId: integer("author_id").notNull(), // references users.id
  points: integer("points").notNull().default(0), // points earned for completion
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Modules table (a course has multiple modules)
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(), // references courses.id
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

// Lessons table (a module has multiple lessons)
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(), // references modules.id
  title: text("title").notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url"), // URL to YouTube or similar video platform
  type: text("type").notNull(), // video, text, quiz, etc.
  duration: integer("duration"), // in minutes
  order: integer("order").notNull(),
  points: integer("points").notNull().default(0), // points earned for completion
});

// Enrollments table (to track user enrollments in courses)
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references users.id
  courseId: integer("course_id").notNull(), // references courses.id
  progress: integer("progress").notNull().default(0), // percentage
  completed: boolean("completed").notNull().default(false),
  certificateIssued: boolean("certificate_issued").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Progress table (to track user progress on individual lessons)
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references users.id
  lessonId: integer("lesson_id").notNull(), // references lessons.id
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  criteria: json("criteria").notNull(), // JSON object with criteria for unlocking
  points: integer("points").notNull().default(0),
});

// User achievements (to track which users have which achievements)
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references users.id
  achievementId: integer("achievement_id").notNull(), // references achievements.id
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Certificates table
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references users.id
  courseId: integer("course_id").notNull(), // references courses.id
  certificateUrl: text("certificate_url"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  points: true, 
  streak: true, 
  lastLogin: true, 
  createdAt: true 
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  progress: true,
  completed: true,
  certificateIssued: true,
  enrolledAt: true,
  completedAt: true
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  completed: true,
  completedAt: true
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
