import MainLayout from "@/components/layouts/MainLayout";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Award } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <MainLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-orbitron text-4xl font-bold text-white mb-4">
            <span className="animate-glow">Winners Leaderboard</span>
          </h1>
          <p className="font-rajdhani text-gray-400 max-w-2xl mx-auto">
            Congratulations to all our giveaway winners! Check out who won our recent prizes and enter our active giveaways for your chance to join the leaderboard.
          </p>
        </div>
        
        {/* Winner Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="cyber-card bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -top-5 -right-5 w-20 h-20 bg-yellow-500 opacity-20 rounded-full blur-xl"></div>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <h3 className="font-orbitron font-bold text-white text-lg mb-2">Grand Prize Winners</h3>
              <p className="font-rajdhani text-gray-400 mb-4">
                These users won our biggest prizes worth 10,000+ Robux or exclusive limited items.
              </p>
              <div className="text-yellow-500 font-rajdhani">
                Highest value prize: 50,000 Robux
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -top-5 -right-5 w-20 h-20 bg-gray-400 opacity-20 rounded-full blur-xl"></div>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-500/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="font-orbitron font-bold text-white text-lg mb-2">Most Active Members</h3>
              <p className="font-rajdhani text-gray-400 mb-4">
                These dedicated users have entered the most giveaways and won multiple prizes.
              </p>
              <div className="text-gray-300 font-rajdhani">
                Most entries: 52 giveaways
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -top-5 -right-5 w-20 h-20 bg-amber-600 opacity-20 rounded-full blur-xl"></div>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <h3 className="font-orbitron font-bold text-white text-lg mb-2">Recent Winners</h3>
              <p className="font-rajdhani text-gray-400 mb-4">
                Congratulations to our newest winners who just received their prizes this week.
              </p>
              <div className="text-amber-600 font-rajdhani">
                Latest draw: Premium Game Pass Bundle
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="font-orbitron text-2xl font-bold text-white mb-6">Winners Leaderboard</h2>
          
          {/* Leaderboard Table Component */}
          <LeaderboardTable />
        </div>
        
        {/* Next Giveaway Promo */}
        <div className="mt-12 p-8 cyber-border rounded-lg bg-gradient-to-r from-black/90 to-black/70 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Want to join the winners?</h2>
              <p className="font-rajdhani text-gray-300">
                Enter our active giveaways for your chance to win and see your name on the leaderboard!
              </p>
            </div>
            <a 
              href="/giveaways" 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-orbitron py-3 px-6 rounded-md transition-colors cyber-btn"
            >
              Enter Giveaways
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
