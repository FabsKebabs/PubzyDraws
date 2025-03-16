import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import LoginPage from "@/pages/LoginPage";
import Canvas from "@/pages/canvas";

function Router() {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="animate-pulse text-cyber-blue text-2xl font-orbitron">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onAuthSuccess={() => {}} />;
  }

  return (
    <Switch>
      <Route path="/" component={Canvas} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
