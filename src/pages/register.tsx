import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { RegisterForm } from "@/components/auth/register-form";
import { Lightbulb } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
          <Lightbulb className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold font-poppins">LearnSmart</h1>
        <p className="text-gray-500 mt-2">Create your account to start learning</p>
      </div>
      
      <RegisterForm />
    </div>
  );
}
