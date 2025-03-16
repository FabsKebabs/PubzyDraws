import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: { username: string; password: string }) => Promise<User>;
  signup: (userData: { username: string; email: string; password: string; confirmPassword: string }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        return await response.json();
      } catch (error) {
        return null;
      }
    },
  });
  
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await response.json();
      return data.user;
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(["/api/auth/user"], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    },
  });
  
  const signupMutation = useMutation({
    mutationFn: async (userData: { username: string; email: string; password: string; confirmPassword: string }) => {
      const response = await apiRequest("POST", "/api/auth/signup", userData);
      const data = await response.json();
      return data.user;
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(["/api/auth/user"], userData);
      toast({
        title: "Account created",
        description: `Welcome to PubzyDraws, ${userData.username}!`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Could not create account";
      const errorField = error.response?.data?.field;
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (errorField) {
        throw { field: errorField, message: errorMessage };
      }
      throw error;
    },
  });
  
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message || "Could not logout",
        variant: "destructive",
      });
    },
  });
  
  const login = async (credentials: { username: string; password: string }) => {
    return loginMutation.mutateAsync(credentials);
  };
  
  const signup = async (userData: { username: string; email: string; password: string; confirmPassword: string }) => {
    return signupMutation.mutateAsync(userData);
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const value = {
    user: user || null,
    isLoading,
    error: error as Error | null,
    login,
    signup,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}