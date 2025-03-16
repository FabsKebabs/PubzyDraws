import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import VideosPage from "@/pages/VideosPage";
import GiveawaysPage from "@/pages/GiveawaysPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import AdminPage from "@/pages/admin/AdminPage";
import HelpCenter from "@/pages/HelpCenter";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

function Router() {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="animate-pulse text-cyber-blue text-2xl font-orbitron">
          Loading NeonPlux...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onAuthSuccess={() => {}} />;
  }

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/giveaways" component={GiveawaysPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/admin" component={AdminPage} />
        <Route path="/help" component={HelpCenter} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/privacy" component={PrivacyPolicy} />
      <Route component={NotFound} />
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