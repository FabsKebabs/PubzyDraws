import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ActiveGiveaways from "@/components/home/ActiveGiveaways";
import LatestUpdates from "@/components/home/LatestUpdates";
import CommunityStats from "@/components/home/CommunityStats";
import EntryForm from "@/components/entry-form";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [entryCount, setEntryCount] = useState<number>(0);

  // Query to fetch the entry count
  const { data: entryData } = useQuery({
    queryKey: ["/api/entries/count"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/entries/count");
      const data = await response.json();
      return data;
    },
  });

  // Update entry count when data changes
  useEffect(() => {
    if (entryData && entryData.count !== undefined) {
      setEntryCount(entryData.count);
    }
  }, [entryData]);

  // Handle entry count update from form submission
  const handleEntryCountUpdate = (count: number) => {
    setEntryCount(count);
  };

  return (
    <MainLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 cyber-border rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
         
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-4">
            
            <Button 
              variant="glow" 
              size="lg" 
              className="font-orbitron text-white shadow-lg"
            >
              Explore Now
            </Button>
          </div>
        </div>
        
        {/* Giveaway Entry Section */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <EntryForm onEntryCountUpdate={handleEntryCountUpdate} />
          </div>
          <div>
            <Card className="cyber-card h-full flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="font-orbitron text-2xl bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Current Entry Stats
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Join the community and enter our exclusive giveaways
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                    {entryCount}
                  </div>
                  <p className="text-gray-300 text-xl">Total Entries</p>
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="h-2 w-full bg-gray-800 rounded-full">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500" 
                        style={{ width: `${Math.min((entryCount / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 flex justify-between">
                      <span>0</span>
                      <span>Goal: 100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Active Giveaways Section */}
        <ActiveGiveaways />
        
        {/* Latest Updates Section */}
        <LatestUpdates />
        
        {/* Community Stats Section */}
        <CommunityStats />
      </div>
    </MainLayout>
  );
}