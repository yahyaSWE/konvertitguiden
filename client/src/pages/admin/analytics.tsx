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
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Users,
  BookOpen,
  Award,
  TrendingUp,
  ArrowUpRight,
  User,
  BookMarked,
  CheckCircle,
  BarChart2,
  Clock
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminAnalytics() {
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

  // Define stats type
  interface AdminStats {
    userStats?: {
      total: number;
      new: number;
      active: number;
      byRole: Array<{ name: string; value: number }>;
    };
    courseStats?: {
      total: number;
      published: number;
      draft: number;
      byCategory: Array<{ category: string; courses: number }>;
      enrollments: number;
      completions: number;
    };
    achievementStats?: {
      total: number;
      unlocked: number;
    };
  }

  // Fetch admin dashboard stats
  const { data: stats = {} as AdminStats, isLoading: isLoadingStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: !!user && user.role === UserRole.ADMIN,
  });

  if (isLoading || isLoadingStats) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Sample data for visualization
  const engagementData = [
    { month: 'Jan', active: 45, courses: 12, completions: 8 },
    { month: 'Feb', active: 52, courses: 15, completions: 10 },
    { month: 'Mar', active: 49, courses: 18, completions: 7 },
    { month: 'Apr', active: 55, courses: 22, completions: 12 },
    { month: 'Maj', active: 60, courses: 20, completions: 15 },
    { month: 'Jun', active: 42, courses: 10, completions: 5 },
    { month: 'Jul', active: 38, courses: 8, completions: 4 },
    { month: 'Aug', active: 40, courses: 9, completions: 6 },
    { month: 'Sep', active: 45, courses: 11, completions: 7 },
    { month: 'Okt', active: 48, courses: 14, completions: 9 },
    { month: 'Nov', active: 51, courses: 16, completions: 11 },
    { month: 'Dec', active: 54, courses: 18, completions: 12 },
  ];

  const coursePopularityData = [
    { name: 'Web Dev', students: 120 },
    { name: 'Islam 101', students: 85 },
    { name: 'Koranen', students: 70 },
    { name: 'Hadith', students: 45 },
    { name: 'Arabiska', students: 30 },
  ];

  const userRoleData = [
    { name: 'Studenter', value: 150 },
    { name: 'Lärare', value: 25 },
    { name: 'Admin', value: 5 },
  ];

  const timeSpentData = [
    { day: 'Mån', timeMins: 120 },
    { day: 'Tis', timeMins: 140 },
    { day: 'Ons', timeMins: 95 },
    { day: 'Tor', timeMins: 105 },
    { day: 'Fre', timeMins: 160 },
    { day: 'Lör', timeMins: 90 },
    { day: 'Sön', timeMins: 75 },
  ];

  const COLORS = ['#16A37F', '#8884d8', '#FF9900', '#FF5733'];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-poppins font-bold">Analytics</h1>
          <p className="text-gray-600">Detaljerad statistik och användartrender</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Aktiva användare</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{stats?.userStats?.active || 0}</h3>
                    <span className="ml-2 text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Aktiva kurser</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{stats?.courseStats?.published || 0}</h3>
                    <span className="ml-2 text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Slutförda kurser</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{stats?.courseStats?.completions || 0}</h3>
                    <span className="ml-2 text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      15%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Totala prestationer</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{stats?.achievementStats?.unlocked || 0}</h3>
                    <span className="ml-2 text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      20%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="engagement" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="courses">Kurser</TabsTrigger>
            <TabsTrigger value="demographics">Demografi</TabsTrigger>
            <TabsTrigger value="time">Tidsspenderat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Användarengagemang över året</CardTitle>
                <CardDescription>Aktiva användare, kurser och slutförda kurser per månad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={engagementData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" name="Aktiva användare" fill="#16A37F" />
                      <Bar dataKey="courses" name="Aktiva kurser" fill="#8884d8" />
                      <Bar dataKey="completions" name="Kurser slutförda" fill="#FF9900" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Kurspopularitet</CardTitle>
                <CardDescription>Antal registrerade studenter per kurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={coursePopularityData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" name="Studenter" fill="#16A37F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics">
            <Card>
              <CardHeader>
                <CardTitle>Användarroller</CardTitle>
                <CardDescription>Fördelning av användartyper</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex justify-center">
                  <ResponsiveContainer width="80%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Tid spenderad</CardTitle>
                <CardDescription>Genomsnittlig tid (minuter) per dag</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeSpentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="timeMins" name="Minuter" stroke="#16A37F" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}