import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { UserRole } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users,
  BookOpen,
  Award,
  TrendingUp,
  ArrowUpRight,
  User,
  Calendar,
  BookMarked,
  CheckCircle,
  BarChart2
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Check admin role
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && user.role !== UserRole.ADMIN) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  // Fetch admin dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!user && user.role === UserRole.ADMIN,
  });

  // Sample data (would be replaced by real API data)
  const userStats = {
    total: 156,
    new: 12,
    active: 98,
    byRole: [
      { name: "Students", value: 130 },
      { name: "Teachers", value: 22 },
      { name: "Admins", value: 4 }
    ]
  };

  const courseStats = {
    total: 24,
    published: 18,
    draft: 6,
    byCategory: [
      { category: "Web Dev", courses: 8 },
      { category: "Data Science", courses: 6 },
      { category: "Design", courses: 4 },
      { category: "Mobile", courses: 3 },
      { category: "Other", courses: 3 }
    ],
    enrollments: 342,
    completions: 178
  };

  const activityData = [
    { date: "Mon", users: 45, enrollments: 12, completions: 8 },
    { date: "Tue", users: 52, enrollments: 15, completions: 10 },
    { date: "Wed", users: 49, enrollments: 18, completions: 7 },
    { date: "Thu", users: 55, enrollments: 22, completions: 12 },
    { date: "Fri", users: 60, enrollments: 20, completions: 15 },
    { date: "Sat", users: 42, enrollments: 10, completions: 5 },
    { date: "Sun", users: 38, enrollments: 8, completions: 4 }
  ];

  const COLORS = ['#2563EB', '#10B981', '#6366F1', '#F59E0B'];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-poppins font-bold text-textColor">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform metrics and management</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{userStats.total}</h3>
                    <span className="ml-2 text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{userStats.new} this week
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Courses</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{courseStats.total}</h3>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {courseStats.published} published
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-secondary/10 rounded-full">
                  <BookOpen className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Enrollments</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{courseStats.enrollments}</h3>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {courseStats.completions} completions
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-accent/10 rounded-full">
                  <Award className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Users</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{userStats.active}</h3>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {Math.round((userStats.active / userStats.total) * 100)}% of total
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>User engagement over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" name="Active Users" fill="#2563EB" />
                      <Bar dataKey="enrollments" name="New Enrollments" fill="#10B981" />
                      <Bar dataKey="completions" name="Course Completions" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Breakdown by user role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userStats.byRole}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userStats.byRole.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} users`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", users: 12 },
                          { month: "Feb", users: 18 },
                          { month: "Mar", users: 15 },
                          { month: "Apr", users: 22 },
                          { month: "May", users: 28 },
                          { month: "Jun", users: 30 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" name="New Users" fill="#2563EB" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Courses by Category</CardTitle>
                  <CardDescription>Distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={courseStats.byCategory}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" />
                        <Tooltip />
                        <Bar dataKey="courses" name="Number of Courses" fill="#10B981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rates</CardTitle>
                  <CardDescription>Course completion statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mr-4">
                      <BookMarked className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Total Enrollments</p>
                        <span className="text-sm font-medium">{courseStats.enrollments}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mr-4">
                      <CheckCircle className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Completed Courses</p>
                        <span className="text-sm font-medium">{courseStats.completions} ({Math.round((courseStats.completions / courseStats.enrollments) * 100)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${(courseStats.completions / courseStats.enrollments) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="ml-4 flex-1 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">New user registered</p>
                      <p className="text-sm text-gray-500">Sarah Johnson created a new account</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <div className="ml-4 flex-1 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">New course published</p>
                      <p className="text-sm text-gray-500">Advanced React Patterns is now available</p>
                    </div>
                    <span className="text-xs text-gray-500">5 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="ml-4 flex-1 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Course milestone</p>
                      <p className="text-sm text-gray-500">Python Fundamentals reached 100 completions</p>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Monthly report available</p>
                      <p className="text-sm text-gray-500">May 2023 platform metrics report is ready</p>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
