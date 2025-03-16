import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { Gift, Clock, Ticket } from "lucide-react";

interface Giveaway {
  id: number;
  title: string;
  description: string;
  prize: string;
  imageUrl: string | null;
  maxEntries: number;
  endDate: string;
  createdAt: string;
  isActive: boolean;
}

export default function GiveawayList() {
  const { data: giveaways, isLoading, error } = useQuery<Giveaway[]>({
    queryKey: ["/api/giveaways"],
    refetchInterval: 3000, // Refetch every 3 seconds for live updates
  });

  const { data: entryCount = { count: 0 } } = useQuery({
    queryKey: ["/api/entries/count"],
  });

  // Force refresh when the component mounts to get latest data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/giveaways"] });
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-1/2">
                <div className="h-6 bg-gray-700 rounded mb-2 w-1/3"></div>
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
              </div>
              <div className="h-14 w-14 rounded-full bg-gray-700"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-4 w-1/4"></div>
            <div className="h-2 bg-gray-700 rounded mb-2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-orbitron text-red-500 mb-2">Error Loading Giveaways</h3>
        <p className="text-gray-400">There was a problem fetching the active giveaways. Please try again later.</p>
      </div>
    );
  }

  if (!giveaways || giveaways.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-orbitron text-white mb-2">No Active Giveaways</h3>
        <p className="text-gray-400">There are no active giveaways at the moment. Check back soon for new opportunities!</p>
      </div>
    );
  }

  const formatTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) return "Ended";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
    }
  };

  const updatedGiveaways = giveaways.map(giveaway => ({
    ...giveaway,
    prize: "R$74,675",
    maxEntries: 10000,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {updatedGiveaways.map((giveaway) => (
        <Card key={giveaway.id} className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-sm relative">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-500 opacity-20 rounded-full blur-xl"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-500 text-xs font-rajdhani rounded-full">
                  EXCLUSIVE
                </span>
                <h3 className="font-orbitron text-xl font-bold text-white mt-2">{giveaway.title}</h3>
              </div>
              <div className="bg-black rounded-full h-14 w-14 flex items-center justify-center cyber-border">
                {giveaway.title.includes("Robux") ? (
                  <Gift className="text-pink-500 h-6 w-6" />
                ) : (
                  <Ticket className="text-primary h-6 w-6" />
                )}
              </div>
            </div>

            <p className="font-rajdhani text-gray-300 mb-4">{giveaway.description}</p>

            <div className="mb-4">
              <div className="flex justify-between text-xs font-rajdhani text-gray-400 mb-1">
                <span>Entries</span>
                <span>{entryCount.count} / {giveaway.maxEntries}</span>
              </div>
              <div className="w-full bg-black rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${Math.min((entryCount.count / giveaway.maxEntries) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-cyan-400 text-sm font-rajdhani flex items-center">
                <Clock className="h-4 w-4 mr-1" /> {formatTimeLeft(giveaway.endDate)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}