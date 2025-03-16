import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Home, Video, Gift, Trophy, Menu, X, Settings, LogOut, User } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      // Force refresh to show login screen
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const links = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { path: "/videos", label: "Videos", icon: <Video className="h-4 w-4 mr-2" /> },
    { path: "/giveaways", label: "Giveaways", icon: <Gift className="h-4 w-4 mr-2" /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy className="h-4 w-4 mr-2" /> },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navigation Bar */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-primary/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-orbitron text-2xl font-bold text-white">PubzyDraws</span>
              </div>
              <div className="hidden md:ml-10 md:flex space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-3 py-2 flex items-center text-sm font-medium font-rajdhani transition-colors duration-300 ${
                      isActive(link.path)
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-300 hover:text-cyan-400 hover:border-b-2 hover:border-cyan-400"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative group">
                  <Link href="/profile">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center cursor-pointer border-2 border-cyan-400 group-hover:border-pink-500 transition-all duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </Link>
                  <div className="absolute right-0 mt-2 w-48 bg-black cyber-border rounded-md shadow-lg overflow-hidden z-50 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 origin-top-right transition-all duration-300">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary/20 hover:text-cyan-400">
                        <User className="h-4 w-4 inline mr-2" /> Your Profile
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary/20 hover:text-cyan-400">
                        <Settings className="h-4 w-4 inline mr-2" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-red-600/20 hover:text-red-500"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-mr-2 ml-4 md:hidden">
                <button
                  type="button"
                  className="bg-black/80 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium font-rajdhani ${
                  isActive(link.path)
                    ? "bg-primary/20 text-primary"
                    : "text-gray-300 hover:bg-cyan-400/20 hover:text-cyan-400"
                }`}
              >
                <span className="flex items-center">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-primary/30">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white font-rajdhani">User</div>
                <div className="text-sm font-medium text-gray-400 font-rajdhani">user@neonplux.com</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-primary/20 hover:text-cyan-400 font-rajdhani"
              >
                <User className="inline h-4 w-4 mr-2" /> Your Profile
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-primary/20 hover:text-cyan-400 font-rajdhani"
              >
                <Settings className="inline h-4 w-4 mr-2" /> Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-500 font-rajdhani"
              >
                <LogOut className="inline h-4 w-4 mr-2" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/95 border-t border-primary/30">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="font-orbitron text-3xl font-bold text-white mb-4">PubzyDraws</div>
              <p className="font-rajdhani text-gray-400 mb-6 max-w-md">
                Your premium destination for art content, exclusive giveaways, and unique artistic experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.615 3.184c-1.548-.57-3.313-.786-5.093-.786-1.78 0-3.545.216-5.093.786-3.827 1.392-6.02 3.583-6.02 7.415v9.6c0 .33.373.69.699.699h3.301v-8.1h.9v8.1h2.7v-8.1h.9v8.1h3.301c.329 0 .699-.369.699-.699v-9.6c0-3.832-2.193-6.023-6.02-7.415z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.772-1.153c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-orbitron text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 font-rajdhani">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path} className="text-gray-400 hover:text-cyan-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-orbitron text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 font-rajdhani">
                <li>
                  <a href="https://discord.gg/5FWvvEXQh8" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li><a href="/help" className="text-gray-400 hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-primary/20">
            <p className="font-rajdhani text-gray-500 text-center text-sm">
              &copy; {new Date().getFullYear()} PubzyDraws. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}