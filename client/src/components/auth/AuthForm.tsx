import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const loginSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long").max(10, "Username must be at most 10 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signupSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long").max(10, "Username must be at most 10 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async () => {
    try {
      // Check form validity manually
      const isValid = await loginForm.trigger();
      if (!isValid) {
        console.log("Form validation failed", loginForm.formState.errors);
        return;
      }

      const formValues = loginForm.getValues();
      console.log("Login data:", formValues);

      const response = await apiRequest("POST", "/api/auth/login", formValues);
      const data = await response.json();

      // Set user data in the cache for React Query
      if (data && data.user) {
        import("@/lib/queryClient").then(({ queryClient }) => {
          queryClient.setQueryData(["/api/auth/user"], data.user);
        });
      }

      toast({
        title: "Login Successful",
        description: "Welcome back to NeonPlux!",
      });

      // Verify session is established
      try {
        const userCheck = await apiRequest("GET", "/api/auth/user");
        console.log("Auth check successful after login");
      } catch (e) {
        console.error("Auth check failed after login:", e);
      }

      onAuthSuccess();
    } catch (error: any) {
      console.error("Login error:", error);

      toast({
        title: "Login Failed",
        description: error?.message || "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async () => {
    try {
      // Check form validity manually since we're not using the react-hook-form's handleSubmit
      const isValid = await signupForm.trigger();
      if (!isValid) {
        console.log("Form validation failed", signupForm.formState.errors);
        return;
      }

      const formValues = signupForm.getValues();
      console.log("Signup data:", formValues);

      // Send the complete form data including confirmPassword
      const signupData = formValues;

      // Ensure we're calling the endpoint with the right path
      const response = await apiRequest("POST", "/api/auth/signup", signupData);
      const data = await response.json();

      // Set user data in the cache for React Query
      if (data && data.user) {
        import("@/lib/queryClient").then(({ queryClient }) => {
          queryClient.setQueryData(["/api/auth/user"], data.user);
        });
      }

      toast({
        title: "Signup Successful",
        description: "Welcome to NeonPlux!",
      });

      // Verify session is established
      try {
        const userCheck = await apiRequest("GET", "/api/auth/user");
        console.log("Auth check successful after signup");
      } catch (e) {
        console.error("Auth check failed after signup:", e);
      }

      onAuthSuccess();
    } catch (error: any) {
      console.error("Signup error:", error);

      toast({
        title: "Signup Failed",
        description: error?.message || "Username or email may already be in use.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="cyber-border bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md w-full space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-600 to-pink-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-600 to-primary"></div>

      <div className="text-center">
        <h2 className="font-orbitron text-3xl font-bold text-white glitch" data-text="PubzyDraws">PubzyDraws</h2>
        <p className="mt-2 text-sm font-rajdhani text-cyan-400">Enter the cyberpunk universe</p>
      </div>

      {/* Login/Signup Tabs */}
      <div className="flex border-b border-primary/30">
        <button
          className={`w-1/2 py-2 font-rajdhani font-medium ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-pink-500'}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-2 font-rajdhani font-medium ${!isLogin ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400 hover:text-primary'}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      {isLogin ? (
        <Form {...loginForm}>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mt-8 space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className={`flex h-10 w-full rounded-md border bg-black/80 text-white pl-10
                    px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${loginForm.formState.errors.username ? 'border-red-500' :
                      (loginForm.formState.dirtyFields.username && !loginForm.formState.errors.username ?
                        'border-green-500 border-2 ring-green-400' : 'border-primary/50')}`}
                  value={loginForm.getValues().username}
                  onChange={(e) => {
                    loginForm.setValue('username', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  onBlur={() => loginForm.trigger('username')}
                />
              </div>
              {loginForm.formState.errors.username && (
                <p className="text-sm font-medium text-red-500 pl-1">
                  {loginForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`flex h-10 w-full rounded-md border bg-black/80 text-white pl-10
                    px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${loginForm.formState.errors.password ? 'border-red-500' :
                      (loginForm.formState.dirtyFields.password && !loginForm.formState.errors.password ?
                        'border-green-500 border-2 ring-green-400' : 'border-primary/50')}`}
                  value={loginForm.getValues().password}
                  onChange={(e) => {
                    loginForm.setValue('password', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  onBlur={() => loginForm.trigger('password')}
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm font-medium text-red-500 pl-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-black border-primary text-cyan-400 focus:ring-cyan-400"
                  onChange={(e) => loginForm.setValue('rememberMe', e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-rajdhani text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="https://discord.gg/5FWvvEXQh8" target="_blank" rel="noopener noreferrer" className="font-rajdhani text-cyan-400 hover:text-pink-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="glow"
              className="w-full font-orbitron"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? "Logging in..." : "Enter The Grid"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...signupForm}>
          <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="mt-8 space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className={`flex h-10 w-full rounded-md border bg-black/80 text-white pl-10
                    px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${signupForm.formState.errors.username ? 'border-red-500' :
                      (signupForm.formState.dirtyFields.username && !signupForm.formState.errors.username ?
                        'border-green-500 border-2 ring-green-400' : 'border-primary/50')}`}
                  value={signupForm.getValues().username}
                  onChange={(e) => {
                    signupForm.setValue('username', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  onBlur={() => signupForm.trigger('username')}
                />
              </div>
              {signupForm.formState.errors.username && (
                <p className="text-sm font-medium text-red-500 pl-1">
                  {signupForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className={`flex h-10 w-full rounded-md border bg-black/80 text-white pl-10
                    px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${signupForm.formState.errors.email ? 'border-red-500' :
                      (signupForm.formState.dirtyFields.email && !signupForm.formState.errors.email ?
                        'border-green-500 border-2 ring-green-400' : 'border-primary/50')}`}
                  value={signupForm.getValues().email}
                  onChange={(e) => {
                    signupForm.setValue('email', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  onBlur={() => signupForm.trigger('email')}
                />
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-sm font-medium text-red-500 pl-1">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`flex h-10 w-full rounded-md border bg-black/80 text-white pl-10
                    px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${signupForm.formState.errors.password ? 'border-red-500' :
                      (signupForm.formState.dirtyFields.password && !signupForm.formState.errors.password ?
                        'border-green-500 border-2 ring-green-400' : 'border-primary/50')}`}
                  value={signupForm.getValues().password}
                  onChange={(e) => {
                    signupForm.setValue('password', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  onBlur={() => signupForm.trigger('password')}
                />
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-sm font-medium text-red-500 pl-1">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`flex h-10 w-full rounded-md border bg-black/80 text-white pl-10
                    px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${signupForm.formState.errors.confirmPassword ? 'border-red-500' :
                      (signupForm.formState.dirtyFields.confirmPassword && !signupForm.formState.errors.confirmPassword ?
                        'border-green-500 border-2 ring-green-400' : 'border-primary/50')}`}
                  value={signupForm.getValues().confirmPassword}
                  onChange={(e) => {
                    signupForm.setValue('confirmPassword', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  onBlur={() => signupForm.trigger('confirmPassword')}
                />
              </div>
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm font-medium text-red-500 pl-1">
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="glow"
              className="w-full font-orbitron bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600"
              disabled={signupForm.formState.isSubmitting}
            >
              {signupForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      )}

      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
}