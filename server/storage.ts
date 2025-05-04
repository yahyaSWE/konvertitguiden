import { 
  users, User, InsertUser,
  courses, Course, InsertCourse,
  modules, Module, InsertModule,
  lessons, Lesson, InsertLesson,
  enrollments, Enrollment, InsertEnrollment,
  progress, Progress, InsertProgress,
  achievements, Achievement, InsertAchievement,
  userAchievements, UserAchievement, InsertUserAchievement,
  certificates, Certificate, InsertCertificate
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Courses
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByAuthor(authorId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Modules
  getModule(id: number): Promise<Module | undefined>;
  getModulesByCourse(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, moduleData: Partial<Module>): Promise<Module | undefined>;
  deleteModule(id: number): Promise<boolean>;

  // Lessons
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByModule(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson | undefined>;
  deleteLesson(id: number): Promise<boolean>;

  // Enrollments
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  getEnrollmentsByUser(userId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, enrollmentData: Partial<Enrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: number): Promise<boolean>;

  // Progress
  getProgressByUserAndLesson(userId: number, lessonId: number): Promise<Progress | undefined>;
  getProgressByUser(userId: number): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  updateProgress(id: number, progressData: Partial<Progress>): Promise<Progress | undefined>;
  deleteProgress(id: number): Promise<boolean>;

  // Achievements
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievementData: Partial<Achievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;

  // User Achievements
  getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined>;
  getUserAchievementsByUser(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  deleteUserAchievement(id: number): Promise<boolean>;

  // Certificates
  getCertificate(userId: number, courseId: number): Promise<Certificate | undefined>;
  getCertificatesByUser(userId: number): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private modules: Map<number, Module>;
  private lessons: Map<number, Lesson>;
  private enrollments: Map<number, Enrollment>;
  private progresses: Map<number, Progress>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private certificates: Map<number, Certificate>;

  private userCurrentId: number;
  private courseCurrentId: number;
  private moduleCurrentId: number;
  private lessonCurrentId: number;
  private enrollmentCurrentId: number;
  private progressCurrentId: number;
  private achievementCurrentId: number;
  private userAchievementCurrentId: number;
  private certificateCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.modules = new Map();
    this.lessons = new Map();
    this.enrollments = new Map();
    this.progresses = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.certificates = new Map();

    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.moduleCurrentId = 1;
    this.lessonCurrentId = 1;
    this.enrollmentCurrentId = 1;
    this.progressCurrentId = 1;
    this.achievementCurrentId = 1;
    this.userAchievementCurrentId = 1;
    this.certificateCurrentId = 1;

    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@learnsmart.com",
      fullName: "Admin User",
      role: "admin",
    });

    // Create teacher user
    this.createUser({
      username: "teacher",
      password: "teacher123",
      email: "teacher@learnsmart.com",
      fullName: "Teacher User",
      role: "teacher",
    });

    // Create student user
    this.createUser({
      username: "student",
      password: "student123",
      email: "student@learnsmart.com",
      fullName: "Alex Johnson",
      role: "student",
    });

    // Create sample courses
    const webDevCourse = this.createCourse({
      title: "Modern JavaScript Fundamentals",
      description: "Master the essential concepts of JavaScript with practical examples and real-world applications.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80",
      category: "Web Development",
      level: "Beginner",
      duration: 8,
      authorId: 2,
      points: 350,
    });

    const pythonCourse = this.createCourse({
      title: "Python for Data Analysis",
      description: "Learn how to analyze and visualize data using Python's powerful libraries like Pandas and Matplotlib.",
      imageUrl: "https://images.unsplash.com/photo-1581093199663-68c6a521388d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80",
      category: "Data Science",
      level: "Intermediate",
      duration: 10,
      authorId: 2,
      points: 450,
    });

    const uxCourse = this.createCourse({
      title: "UI/UX Design Principles",
      description: "Discover the fundamentals of creating user-centered designs that engage and delight your audience.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80",
      category: "UX Design",
      level: "Beginner",
      duration: 6,
      authorId: 2,
      points: 300,
    });

    // Create sample modules for JavaScript course
    const jsModule1 = this.createModule({
      courseId: webDevCourse.id,
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript programming",
      order: 1,
    });

    const jsModule2 = this.createModule({
      courseId: webDevCourse.id,
      title: "Working with DOM",
      description: "Manipulate HTML elements using JavaScript",
      order: 2,
    });

    // Create sample lessons for JavaScript modules
    this.createLesson({
      moduleId: jsModule1.id,
      title: "Introduction to JavaScript",
      content: "JavaScript is a programming language that runs in the browser...",
      type: "text",
      duration: 15,
      order: 1,
      points: 10,
    });

    this.createLesson({
      moduleId: jsModule1.id,
      title: "Variables and Data Types",
      content: "Learn about variables, constants, and data types in JavaScript...",
      type: "text",
      duration: 20,
      order: 2,
      points: 15,
    });

    // Create sample modules for Python course
    const pyModule1 = this.createModule({
      courseId: pythonCourse.id,
      title: "Python Basics",
      description: "Introduction to Python programming language",
      order: 1,
    });

    // Create sample lessons for Python modules
    this.createLesson({
      moduleId: pyModule1.id,
      title: "Getting Started with Python",
      content: "Python is a versatile programming language...",
      type: "text",
      duration: 25,
      order: 1,
      points: 20,
    });

    // Create sample achievements
    this.createAchievement({
      title: "First Course Completed",
      description: "Complete your first course",
      imageUrl: "course-complete-badge.svg",
      criteria: { type: "course_completion", count: 1 },
      points: 50,
    });

    this.createAchievement({
      title: "5-Day Streak",
      description: "Log in for 5 consecutive days",
      imageUrl: "streak-badge.svg",
      criteria: { type: "login_streak", days: 5 },
      points: 25,
    });

    this.createAchievement({
      title: "Quiz Master",
      description: "Score 100% on 5 quizzes",
      imageUrl: "quiz-badge.svg",
      criteria: { type: "quiz_completion", score: 100, count: 5 },
      points: 75,
    });

    // Create sample enrollments
    this.createEnrollment({
      userId: 3,
      courseId: webDevCourse.id,
    });

    this.createEnrollment({
      userId: 3,
      courseId: pythonCourse.id,
    });

    this.createEnrollment({
      userId: 3,
      courseId: uxCourse.id,
    });

    // Update enrollment progress
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

    // Assign achievements to student
    this.createUserAchievement({
      userId: 3,
      achievementId: 1,
    });

    this.createUserAchievement({
      userId: 3,
      achievementId: 2,
    });

    // Update student with points
    this.updateUser(3, { points: 1248, streak: 5 });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const newUser: User = { 
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

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByAuthor(authorId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.authorId === authorId
    );
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseCurrentId++;
    const now = new Date();
    const newCourse: Course = { 
      ...course, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;

    const updatedCourse = { ...course, ...courseData, updatedAt: new Date() };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Module methods
  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async getModulesByCourse(courseId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter((module) => module.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async createModule(module: InsertModule): Promise<Module> {
    const id = this.moduleCurrentId++;
    const newModule: Module = { ...module, id };
    this.modules.set(id, newModule);
    return newModule;
  }

  async updateModule(id: number, moduleData: Partial<Module>): Promise<Module | undefined> {
    const module = this.modules.get(id);
    if (!module) return undefined;

    const updatedModule = { ...module, ...moduleData };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }

  async deleteModule(id: number): Promise<boolean> {
    return this.modules.delete(id);
  }

  // Lesson methods
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter((lesson) => lesson.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = this.lessonCurrentId++;
    const newLesson: Lesson = { ...lesson, id };
    this.lessons.set(id, newLesson);
    return newLesson;
  }

  async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;

    const updatedLesson = { ...lesson, ...lessonData };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }

  async deleteLesson(id: number): Promise<boolean> {
    return this.lessons.delete(id);
  }

  // Enrollment methods
  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
    );
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.courseId === courseId
    );
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentCurrentId++;
    const now = new Date();
    const newEnrollment: Enrollment = { 
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

  async updateEnrollment(id: number, enrollmentData: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return undefined;

    const updatedEnrollment = { ...enrollment, ...enrollmentData };
    // If marking as completed, set completedAt time
    if (enrollmentData.completed && !enrollment.completed) {
      updatedEnrollment.completedAt = new Date();
    }
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    return this.enrollments.delete(id);
  }

  // Progress methods
  async getProgressByUserAndLesson(userId: number, lessonId: number): Promise<Progress | undefined> {
    return Array.from(this.progresses.values()).find(
      (progress) => progress.userId === userId && progress.lessonId === lessonId
    );
  }

  async getProgressByUser(userId: number): Promise<Progress[]> {
    return Array.from(this.progresses.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const id = this.progressCurrentId++;
    const newProgress: Progress = { 
      ...progressData, 
      id, 
      completed: false, 
      completedAt: null 
    };
    this.progresses.set(id, newProgress);
    return newProgress;
  }

  async updateProgress(id: number, progressData: Partial<Progress>): Promise<Progress | undefined> {
    const progress = this.progresses.get(id);
    if (!progress) return undefined;

    const updatedProgress = { ...progress, ...progressData };
    // If marking as completed, set completedAt time
    if (progressData.completed && !progress.completed) {
      updatedProgress.completedAt = new Date();
    }
    this.progresses.set(id, updatedProgress);
    return updatedProgress;
  }

  async deleteProgress(id: number): Promise<boolean> {
    return this.progresses.delete(id);
  }

  // Achievement methods
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementCurrentId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async updateAchievement(id: number, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;

    const updatedAchievement = { ...achievement, ...achievementData };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    return this.achievements.delete(id);
  }

  // User Achievement methods
  async getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined> {
    return Array.from(this.userAchievements.values()).find(
      (ua) => ua.userId === userId && ua.achievementId === achievementId
    );
  }

  async getUserAchievementsByUser(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (ua) => ua.userId === userId
    );
  }

  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.userAchievementCurrentId++;
    const now = new Date();
    const newUserAchievement: UserAchievement = { 
      ...userAchievement, 
      id, 
      unlockedAt: now 
    };
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }

  async deleteUserAchievement(id: number): Promise<boolean> {
    return this.userAchievements.delete(id);
  }

  // Certificate methods
  async getCertificate(userId: number, courseId: number): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(
      (cert) => cert.userId === userId && cert.courseId === courseId
    );
  }

  async getCertificatesByUser(userId: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(
      (cert) => cert.userId === userId
    );
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateCurrentId++;
    const now = new Date();
    const newCertificate: Certificate = { 
      ...certificate, 
      id, 
      issuedAt: now 
    };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }
}

export const storage = new MemStorage();
