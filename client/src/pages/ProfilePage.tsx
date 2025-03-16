import MainLayout from "@/components/layouts/MainLayout";
import ProfileForm from "@/components/profile/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trophy, Gift } from "lucide-react";

interface GiveawayEntry {
  id: number;
  giveawayId: number;
  userId: number;
  enteredAt: string;
  isWinner: boolean;
}

export default function ProfilePage() {
  const { data: entries, isLoading: entriesLoading } = useQuery<GiveawayEntry[]>({
    queryKey: ["/api/user/entries"],
    // This will show an empty state since this endpoint isn't implemented yet
    enabled: false,
  });

  return (
    <MainLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-white mb-4">
            My Profile
          </h1>
          <p className="font-rajdhani text-gray-400 max-w-3xl">
            Manage your account settings, track your giveaway entries, and update your personal information.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Profile Form Component */}
            <ProfileForm />
          </div>
          
          <div className="space-y-6">
            {/* Recent Activity Card */}
            <Card className="cyber-border bg-black/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold text-white mb-4">Recent Activity</h3>
                
                {entriesLoading ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : entries && entries.length > 0 ? (
                  <div className="space-y-4">
                    {entries.map(entry => (
                      <div key={entry.id} className="border-b border-primary/20 pb-3 last:border-0">
                        <div className="flex items-start">
                          <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                            <Gift className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-rajdhani text-white">
                              You entered a giveaway
                              {entry.isWinner && (
                                <span className="text-yellow-500 ml-1">and won!</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(entry.enteredAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Trophy className="h-12 w-12 text-primary/30 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">You haven't entered any giveaways yet.</p>
                    <Link href="/giveaways" className="text-primary hover:text-cyan-400 transition-colors font-rajdhani">
                      Browse active giveaways →
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Account Stats Card */}
            <Card className="cyber-border bg-black/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold text-white mb-4">Account Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                    <span className="font-rajdhani text-gray-400">Joined</span>
                    <span className="font-rajdhani text-white">April 2023</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                    <span className="font-rajdhani text-gray-400">Giveaways Entered</span>
                    <span className="font-rajdhani text-white">14</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                    <span className="font-rajdhani text-gray-400">Giveaways Won</span>
                    <span className="font-rajdhani text-yellow-500">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-rajdhani text-gray-400">Total Prize Value</span>
                    <span className="font-rajdhani text-pink-500">2,500 Robux</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Connected Accounts Card */}
            <Card className="cyber-border bg-black/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold text-white mb-4">Connected Accounts</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#FF0000]/10 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-1.548-.57-3.313-.786-5.093-.786-1.78 0-3.545.216-5.093.786-3.827 1.392-6.02 3.583-6.02 7.415v9.6c0 .33.373.69.699.699h3.301v-8.1h.9v8.1h2.7v-8.1h.9v8.1h3.301c.329 0 .699-.369.699-.699v-9.6c0-3.832-2.193-6.023-6.02-7.415z"/>
                        </svg>
                      </div>
                      <span className="font-rajdhani text-white">YouTube</span>
                    </div>
                    <span className="text-red-500 text-sm font-rajdhani">Not Connected</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#5865F2]/10 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                      </div>
                      <span className="font-rajdhani text-white">Discord</span>
                    </div>
                    <span className="text-red-500 text-sm font-rajdhani">Not Connected</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#00A4FF]/10 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-[#00A4FF]" viewBox="0 0 512 512" fill="currentColor">
                          <path d="M296.7 55.7l-30.7 39.3-56.7-16-28.7 39.8-57.3-14.7L0 256l128 128 54-15 26 37.3 56.7-15.3 28.7 38.7L512 256 296.7 55.7z"/>
                        </svg>
                      </div>
                      <span className="font-rajdhani text-white">Roblox</span>
                    </div>
                    <span className="text-red-500 text-sm font-rajdhani">Not Connected</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-xs text-gray-400 text-center">
                    Account linking coming soon! Connect your accounts to verify ownership and receive prizes directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
