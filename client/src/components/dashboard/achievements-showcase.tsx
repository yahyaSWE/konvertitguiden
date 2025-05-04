import { Award, CheckCircle, Zap, Star, Users, Beaker } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export function AchievementsShowcase() {
  const { user } = useAuth();
  const { data: userAchievements, isLoading } = useQuery({
    queryKey: ['/api/achievements/me'],
    enabled: !!user
  });
  
  const { data: allAchievements } = useQuery({
    queryKey: ['/api/achievements'],
  });
  
  // Map achievements to display properties
  const achievementsData = [
    {
      name: "Första kursen avslutad",
      date: userAchievements?.find(ua => ua.achievement?.title === "First Course Completed")?.unlockedAt,
      icon: <CheckCircle className="h-8 w-8" />,
      color: "bg-indigo-100 text-accent",
      unlocked: !!userAchievements?.find(ua => ua.achievement?.title === "First Course Completed")
    },
    {
      name: "5-dagars svit",
      date: userAchievements?.find(ua => ua.achievement?.title === "5-Day Streak")?.unlockedAt,
      icon: <Zap className="h-8 w-8" />,
      color: "bg-green-100 text-secondary",
      unlocked: !!userAchievements?.find(ua => ua.achievement?.title === "5-Day Streak")
    },
    {
      name: "Quizmästare",
      date: userAchievements?.find(ua => ua.achievement?.title === "Quiz Master")?.unlockedAt,
      icon: <Star className="h-8 w-8" />,
      color: "bg-amber-100 text-amber-500",
      unlocked: !!userAchievements?.find(ua => ua.achievement?.title === "Quiz Master")
    },
    {
      name: "Kurssamlare",
      date: userAchievements?.find(ua => ua.achievement?.title === "Course Collector")?.unlockedAt,
      icon: <Award className="h-8 w-8" />,
      color: "bg-blue-100 text-primary",
      unlocked: !!userAchievements?.find(ua => ua.achievement?.title === "Course Collector")
    },
    {
      name: "Social lärande",
      date: null,
      icon: <Users className="h-8 w-8" />,
      color: "bg-gray-100 text-gray-400",
      unlocked: false
    },
    {
      name: "Vetenskapsutforskare",
      date: null,
      icon: <Beaker className="h-8 w-8" />,
      color: "bg-gray-100 text-gray-400",
      unlocked: false
    }
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-poppins font-semibold text-textColor">Senaste prestationer</h2>
        <Link href="/achievements" className="text-primary text-sm font-medium hover:underline">
          Visa alla
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {achievementsData.map((achievement, index) => (
          <div 
            key={index}
            className={`badge flex flex-col items-center justify-center p-4 ${!achievement.unlocked ? 'opacity-40 disabled' : ''}`}
          >
            <div className={`rounded-full p-3 mb-3 ${achievement.color}`}>
              {achievement.icon}
            </div>
            <span className={`text-sm font-medium text-center ${!achievement.unlocked ? 'text-gray-400' : ''}`}>
              {achievement.name}
            </span>
            <span className="text-xs text-gray-500">
              {achievement.unlocked 
                ? formatDate(achievement.date || '') 
                : "Låst"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
