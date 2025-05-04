import { Link, useLocation } from "wouter";
import { Home, BookOpen, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
      <div className="flex justify-around">
        <NavItem 
          href="/dashboard" 
          icon={<Home className="h-6 w-6" />} 
          label="Hem"
          isActive={location === "/" || location === "/dashboard"} 
        />
        <NavItem 
          href="/courses" 
          icon={<BookOpen className="h-6 w-6" />} 
          label="Kurser"
          isActive={location.startsWith("/courses")} 
        />
        <NavItem 
          href="/achievements" 
          icon={<Star className="h-6 w-6" />} 
          label="Prestationer"
          isActive={location === "/achievements"} 
        />
        <NavItem 
          href="/profile" 
          icon={<User className="h-6 w-6" />} 
          label="Profil"
          isActive={location === "/profile" || location === "/settings"} 
        />
      </div>
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <div className={cn(
        "flex flex-col items-center",
        isActive ? "text-primary" : "text-gray-500"
      )}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
}
