import MainLayout from "@/components/layouts/MainLayout";
import GiveawayList from "@/components/giveaways/GiveawayList";
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function GiveawaysPage() {
  return (
    <MainLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-orbitron text-4xl font-bold text-white mb-4">
            <span className="animate-glow">Active Giveaways</span>
          </h1>
          <p className="font-rajdhani text-gray-400 max-w-2xl mx-auto">
            Enter our exclusive giveaways for a chance to win amazing Roblox prizes, game passes, and Robux! New giveaways are added regularly.
          </p>
        </div>
        
        {/* Featured Giveaway Banner */}
        <Card className="mb-12 cyber-border bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <div className="inline-block mb-4 p-3 rounded-full bg-pink-500/20">
                  <Gift className="h-8 w-8 text-pink-500" />
                </div>
                <h2 className="font-orbitron text-3xl font-bold text-white mb-4">
                  How Giveaways Work
                </h2>
                <p className="font-rajdhani text-gray-300 max-w-xl mb-6">
                  Our giveaways are open to all registered users. Simply click the "Enter Now" button on any active giveaway to participate. Winners are selected randomly and announced on our website and YouTube channel.
                </p>
                <ul className="font-rajdhani text-gray-300 space-y-2 text-left">
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Create an account or log in to participate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>Enter as many active giveaways as you want</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Winners are randomly selected when the giveaway ends</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
                    <span>Winners receive notification via email and appear on the leaderboard</span>
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 p-6 rounded-lg cyber-border max-w-sm w-full">
                <div className="text-center">
                  <div className="inline-block h-16 w-16 rounded-full bg-gradient-to-r from-primary to-pink-500 flex items-center justify-center mb-4">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                    Prize Types
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div className="bg-black/60 rounded-md p-3">
                      <div className="font-rajdhani font-semibold text-pink-500">Robux</div>
                      <div className="text-sm text-gray-400">Virtual currency for Roblox</div>
                    </div>
                    <div className="bg-black/60 rounded-md p-3">
                      <div className="font-rajdhani font-semibold text-primary">Game Passes</div>
                      <div className="text-sm text-gray-400">Premium access to popular games</div>
                    </div>
                    <div className="bg-black/60 rounded-md p-3">
                      <div className="font-rajdhani font-semibold text-cyan-400">Limited Items</div>
                      <div className="text-sm text-gray-400">Rare collectibles and accessories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="font-orbitron text-2xl font-bold text-white mb-6">Current Giveaways</h2>
        
        {/* Giveaway List Component */}
        <GiveawayList />
      </div>
    </MainLayout>
  );
}
