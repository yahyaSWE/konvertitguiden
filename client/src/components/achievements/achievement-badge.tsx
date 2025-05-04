import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { 
  Award, 
  Check, 
  Star, 
  Zap, 
  BookOpen, 
  Users,
  Beaker,
  Trophy,
  Target,
  Medal
} from "lucide-react";

interface AchievementBadgeProps {
  achievement: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    points: number;
    unlockedAt?: string;
  };
  unlocked: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function AchievementBadge({ 
  achievement, 
  unlocked, 
  size = "md",
  onClick
}: AchievementBadgeProps) {
  const { title, description, points, unlockedAt } = achievement;

  const getIcon = () => {
    // Map achievement titles to icons (could be more sophisticated with a mapping)
    if (title.includes("Course")) return <BookOpen className="h-full w-full" />;
    if (title.includes("Quiz")) return <Star className="h-full w-full" />;
    if (title.includes("Streak")) return <Zap className="h-full w-full" />;
    if (title.includes("Social")) return <Users className="h-full w-full" />;
    if (title.includes("Science")) return <Beaker className="h-full w-full" />;
    if (title.includes("Master")) return <Trophy className="h-full w-full" />;
    if (title.includes("Expert")) return <Target className="h-full w-full" />;
    if (title.includes("Complete")) return <Check className="h-full w-full" />;
    if (title.includes("Champion")) return <Medal className="h-full w-full" />;
    
    // Default icon
    return <Award className="h-full w-full" />;
  };

  const sizeClasses = {
    sm: {
      badge: "p-2",
      icon: "w-10 h-10 mb-2",
      title: "text-xs",
      date: "text-[10px]"
    },
    md: {
      badge: "p-4",
      icon: "w-12 h-12 mb-3",
      title: "text-sm",
      date: "text-xs"
    },
    lg: {
      badge: "p-6",
      icon: "w-16 h-16 mb-4",
      title: "text-base",
      date: "text-sm"
    }
  };

  const getColorClass = () => {
    if (!unlocked) return "bg-gray-100 text-gray-400";
    
    // Match colors to achievement types
    if (title.includes("Course")) return "bg-blue-100 text-primary";
    if (title.includes("Quiz")) return "bg-amber-100 text-amber-500";
    if (title.includes("Streak")) return "bg-green-100 text-secondary";
    if (title.includes("Social")) return "bg-indigo-100 text-accent";
    if (title.includes("Science")) return "bg-purple-100 text-purple-500";
    
    // Default color
    return "bg-indigo-100 text-accent";
  };

  return (
    <div 
      className={cn(
        "badge flex flex-col items-center justify-center text-center",
        unlocked ? "" : "opacity-40 disabled",
        onClick ? "cursor-pointer" : "",
        sizeClasses[size].badge
      )}
      onClick={onClick}
    >
      <div className={cn(
        "rounded-full p-3 mb-3",
        sizeClasses[size].icon,
        getColorClass()
      )}>
        {getIcon()}
      </div>
      <span className={cn(
        "font-medium text-center",
        unlocked ? "" : "text-gray-400",
        sizeClasses[size].title
      )}>
        {title}
      </span>
      {unlocked ? (
        <span className={cn("text-gray-500", sizeClasses[size].date)}>
          {unlockedAt ? formatDate(unlockedAt) : "Unlocked"}
        </span>
      ) : (
        <span className={cn("text-gray-400", sizeClasses[size].date)}>
          {points} points to unlock
        </span>
      )}
    </div>
  );
}
