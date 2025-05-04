import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Calendar, CheckCircle, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function DashboardStats() {
  const { user } = useAuth();
  
  const { data: enrollments } = useQuery({
    queryKey: ['/api/enrollments/me'],
    enabled: !!user
  });

  // Calculate stats from enrollments
  const inProgressCourses = enrollments?.filter(e => !e.completed)?.length || 0;
  const completedCourses = enrollments?.filter(e => e.completed)?.length || 0;
  const thisMonthCompleted = 0; // Would be calculated from actual data
  const dueSoon = 0; // Would be calculated from actual data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Courses in Progress"
        value={inProgressCourses.toString()}
        subtitle={`${dueSoon} due this week`}
        icon={<BookOpen className="h-5 w-5" />}
        color="primary"
      />
      
      <StatCard 
        title="Completed Courses"
        value={completedCourses.toString()}
        subtitle={`+${thisMonthCompleted} this month`}
        icon={<CheckCircle className="h-5 w-5" />}
        color="secondary"
      />
      
      <StatCard 
        title="Learning Streaks"
        value={`${user?.streak || 0} days`}
        subtitle="Best: 14 days"
        icon={<Calendar className="h-5 w-5" />}
        color="amber"
      />
      
      <StatCard 
        title="Total Points"
        value={user?.points?.toString() || "0"}
        subtitle="Level 4 Learner"
        icon={<Star className="h-5 w-5" />}
        color="accent"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent" | "amber";
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorMap = {
    primary: "text-primary bg-blue-50",
    secondary: "text-secondary bg-green-50",
    accent: "text-accent bg-indigo-50",
    amber: "text-amber-500 bg-amber-50"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <span className={`p-2 rounded-full ${colorMap[color]}`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-semibold text-textColor">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
