import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import { useTheme } from "@/components/ui/theme-provider";
import ThemeButtonSimple from "@/components/theme-button-simple";

import {
  BarChart2,
  BookOpen,
  Home,
  LogOut,
  Settings,
  Star,
  User,
  Users,
  Lightbulb,
  PenTool,
  Moon,
  Sun,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const role = user?.role || "student";

  // Common menu items for all roles
  const commonItems = [
    {
      title: "Dashboard",
      href: role === "admin" ? "/admin/dashboard" : "/dashboard",
      icon: <Home className="w-5 h-5 mr-3" />,
      isActive: location === "/dashboard" || location === "/admin/dashboard" || location === "/",
    },
    {
      title: "My Courses",
      href: "/courses",
      icon: <BookOpen className="w-5 h-5 mr-3" />,
      isActive: location.startsWith("/courses") && !location.includes("/create") && !location.includes("/edit"),
    },
    {
      title: "Achievements",
      href: "/achievements",
      icon: <Star className="w-5 h-5 mr-3" />,
      isActive: location === "/achievements",
    },
  ];

  // Teacher-specific menu items
  const teacherItems = [
    {
      title: "Create Course",
      href: "/courses/create",
      icon: <PenTool className="w-5 h-5 mr-3" />,
      isActive: location === "/courses/create",
    },
  ];

  // Admin-specific menu items
  const adminItems = [
    {
      title: "User Management",
      href: "/admin/users",
      icon: <Users className="w-5 h-5 mr-3" />,
      isActive: location === "/admin/users",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="w-5 h-5 mr-3" />,
      isActive: location === "/admin/analytics",
    },
  ];

  // Account menu items
  const accountItems = [
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="w-5 h-5 mr-3" />,
      isActive: location === "/profile",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5 mr-3" />,
      isActive: location === "/settings",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-md p-2">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-poppins font-bold text-sidebar-foreground">Konvertit Guiden</h1>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="py-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          {commonItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item flex items-center px-3 py-2 text-sm rounded-md",
                item.isActive ? "active" : "text-sidebar-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>

        {(role === UserRole.TEACHER || role === UserRole.ADMIN) && (
          <div className="py-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">Instructor</p>
            {role === UserRole.TEACHER && 
              teacherItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "sidebar-item flex items-center px-3 py-2 text-sm rounded-md",
                    item.isActive ? "active" : "text-sidebar-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))
            }
            {role === UserRole.ADMIN && 
              adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "sidebar-item flex items-center px-3 py-2 text-sm rounded-md",
                    item.isActive ? "active" : "text-sidebar-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))
            }
          </div>
        )}

        <div className="py-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">Account</p>
          {accountItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item flex items-center px-3 py-2 text-sm rounded-md",
                item.isActive ? "active" : "text-sidebar-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
          <button
            onClick={() => {
              const root = window.document.documentElement;
              const isDark = root.classList.contains("dark");
              
              if (isDark) {
                root.classList.remove("dark");
                root.classList.add("light");
                localStorage.setItem("konvertit-theme", "light");
                console.log("Theme set to light (direct from sidebar)");
              } else {
                root.classList.remove("light");
                root.classList.add("dark");
                localStorage.setItem("konvertit-theme", "dark");
                console.log("Theme set to dark (direct from sidebar)");
              }
            }}
            className="sidebar-item flex items-center px-3 py-2 text-sm rounded-md w-full text-left text-sidebar-foreground"
          >
            <Moon className="w-5 h-5 mr-3" />
            Byt tema
          </button>
          <button
            onClick={logout}
            className="sidebar-item flex items-center px-3 py-2 text-sm text-red-600 rounded-md w-full text-left"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logga ut
          </button>
        </div>
      </div>
    </aside>
  );
}
