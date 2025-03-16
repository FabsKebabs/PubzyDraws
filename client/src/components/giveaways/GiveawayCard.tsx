import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Clock, Ticket } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GiveawayProps {
  id: number;
  title: string;
  description: string;
  prize: string;
  imageUrl: string | null;
  maxEntries: number;
  endDate: string;
  createdAt: string;
  isActive: boolean;
  entriesCount?: number;
  hasEntered?: boolean;
}

export default function GiveawayCard({ 
  id, 
  title, 
  description, 
  prize, 
  maxEntries, 
  endDate,
  entriesCount = 0,
  hasEntered = false
}: GiveawayProps) {
  const { toast } = useToast();
  const [isEntering, setIsEntering] = useState(false);
  const [isEnteredState, setIsEnteredState] = useState(hasEntered);
  
  // Helper to format date countdown
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

  const [localEntriesCount, setLocalEntriesCount] = useState(entriesCount || 0);
  
  useEffect(() => {
    setLocalEntriesCount(entriesCount || 0);
  }, [entriesCount]);
  
  const enterGiveaway = async () => {
    if (isEnteredState) return;
    
    setIsEntering(true);
    try {
      await apiRequest("POST", `/api/giveaways/${id}/enter`, { giveawayId: id, userId: 0 });
      setIsEnteredState(true);
      setLocalEntriesCount(prev => prev + 1);
      toast({
        title: "Successfully entered!",
        description: "Good luck! Winners will be announced soon.",
      });
      // Force refetch to get updated data
      await queryClient.invalidateQueries({ queryKey: ["/api/giveaways"] });
      await queryClient.refetchQueries({ queryKey: ["/api/giveaways"] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to enter giveaway";
      toast({
        title: "Entry Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEntering(false);
    }
  };

  const isPrizeBased = title.toLowerCase().includes("robux");
  const gradientColors = isPrizeBased 
    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600" 
    : "bg-gradient-to-r from-primary to-cyan-500 hover:from-cyan-500 hover:to-primary";
  const progressBarColors = isPrizeBased
    ? "bg-gradient-to-r from-primary to-pink-500"
    : "bg-gradient-to-r from-cyan-400 to-primary";
  const badgeColor = isPrizeBased
    ? "bg-pink-500/20 text-pink-500"
    : "bg-primary/20 text-primary";
  const glow = isPrizeBased ? "pink-500" : "primary";

  return (
    <Card className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-sm relative cyber-card">
      <div className={`absolute -top-4 -right-4 w-20 h-20 bg-${glow} opacity-20 rounded-full blur-xl`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`px-3 py-1 ${badgeColor} text-xs font-rajdhani rounded-full inline-block`}>
              {isPrizeBased ? "EXCLUSIVE" : "PREMIUM"}
            </span>
            <h3 className="font-orbitron text-xl font-bold text-white mt-2">{title}</h3>
          </div>
          <div className="bg-black rounded-full h-14 w-14 flex items-center justify-center cyber-border">
            {isPrizeBased ? (
              <Gift className="text-pink-500 h-6 w-6" />
            ) : (
              <Ticket className="text-primary h-6 w-6" />
            )}
          </div>
        </div>
        
        <p className="font-rajdhani text-gray-300 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs font-rajdhani text-gray-400 mb-1">
            <span>Entries</span>
            <span>{localEntriesCount} / {maxEntries}</span>
          </div>
          <div className="w-full bg-black rounded-full h-2 mb-2">
            <div 
              className={`${progressBarColors} h-2 rounded-full`} 
              style={{ width: `${Math.min(((localEntriesCount || 0) / maxEntries) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-cyan-400 text-sm font-rajdhani flex items-center">
            <Clock className="h-4 w-4 mr-1" /> {formatTimeLeft(endDate)}
          </div>
          <Button
            variant={isPrizeBased ? "glow" : "default"}
            className={gradientColors}
            onClick={enterGiveaway}
            disabled={isEnteredState || isEntering}
          >
            {isEntering ? "Entering..." : isEnteredState ? "Entered" : "Enter Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
