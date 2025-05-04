import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/auth/login-form";
import { Lightbulb } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Omdirigera till dashboard om redan autentiserad
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return null; // Eller en laddningsindikator
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
          <Lightbulb className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold font-poppins">Konvertit Guiden</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Din inlärningsresa börjar här</p>
      </div>
      
      <LoginForm />
    </div>
  );
}
