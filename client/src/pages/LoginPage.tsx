import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface LoginPageProps {
  onAuthSuccess?: () => void;
}

export default function LoginPage({ onAuthSuccess }: LoginPageProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Create particles container if it doesn't exist
  useEffect(() => {
    const container = document.getElementById('particles-js');
    if (!container) {
      const particlesContainer = document.createElement("div");
      particlesContainer.id = "particles-js";
      particlesContainer.className = "fixed top-0 left-0 w-full h-full z-[-1]";
      document.body.prepend(particlesContainer);
    }
  }, []);

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    }
  }, [user, navigate, onAuthSuccess]);

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm onAuthSuccess={handleAuthSuccess} />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
}
