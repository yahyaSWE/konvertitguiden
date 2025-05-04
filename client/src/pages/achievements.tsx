import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { AchievementBadge } from "@/components/achievements/achievement-badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Trophy, Filter } from "lucide-react";

export default function Achievements() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Fetch user achievements
  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/achievements/me'],
    enabled: !!user
  });

  // Fetch all possible achievements
  const { data: allAchievements, isLoading: allAchievementsLoading } = useQuery({
    queryKey: ['/api/achievements'],
  });

  if (achievementsLoading || allAchievementsLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Map user achievements to a set of IDs for easy checking
  const unlockedAchievementIds = new Set(
    userAchievements?.map((ua: any) => ua.achievementId) || []
  );

  // Combine user achievements with all achievements
  const achievements = allAchievements?.map((achievement: any) => ({
    ...achievement,
    unlocked: unlockedAchievementIds.has(achievement.id),
    unlockedAt: userAchievements?.find((ua: any) => ua.achievementId === achievement.id)?.unlockedAt
  })) || [];

  // Achievement categories (derived from data)
  const categories = [
    { id: "all", name: "All Achievements" },
    { id: "course", name: "Course Achievements" },
    { id: "streak", name: "Streak Achievements" },
    { id: "quiz", name: "Quiz Achievements" },
    { id: "misc", name: "Other Achievements" }
  ];

  // Filter achievements by category
  const filteredAchievements = achievements.filter((achievement: any) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "course" && achievement.title.toLowerCase().includes("course")) return true;
    if (categoryFilter === "streak" && achievement.title.toLowerCase().includes("streak")) return true;
    if (categoryFilter === "quiz" && achievement.title.toLowerCase().includes("quiz")) return true;
    if (categoryFilter === "misc" && 
        !achievement.title.toLowerCase().includes("course") &&
        !achievement.title.toLowerCase().includes("streak") &&
        !achievement.title.toLowerCase().includes("quiz")) return true;
    return false;
  });

  // Count unlocked achievements
  const unlockedCount = achievements.filter((a: any) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a: any) => a.unlocked)
    .reduce((sum: number, a: any) => sum + a.points, 0);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-poppins font-bold text-textColor">Achievements</h1>
          <p className="text-gray-600">Track your progress and earn badges</p>
        </div>

        {/* Stats Banner */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="bg-primary/10 text-primary p-3 rounded-full mr-4">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Total Achievements</h3>
                <p className="text-2xl font-semibold">
                  {unlockedCount} <span className="text-sm text-gray-500">/ {achievements.length}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-secondary/10 text-secondary p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Points Earned</h3>
                <p className="text-2xl font-semibold">{totalPoints}</p>
              </div>
            </div>
            
            <div className="md:text-right">
              <div className="flex md:justify-end items-center mb-2">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500 mr-2">Filter:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-500">
                Showing {filteredAchievements.length} achievements
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAchievements.map((achievement: any) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={achievement.unlocked}
              size="lg"
            />
          ))}
          
          {filteredAchievements.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Achievements Found</h3>
              <p className="text-gray-500">
                {categoryFilter !== "all" 
                  ? "Try selecting a different category filter" 
                  : "Complete courses and activities to earn achievements"}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
