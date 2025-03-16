import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Bell, Trophy, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Update {
  id: number;
  title: string;
  content: string;
  type: string;
  iconName: string | null;
  createdAt: string;
}

export default function LatestUpdates() {
  const [displayCount, setDisplayCount] = useState(3);
  
  const { data: updates, isLoading, error } = useQuery<Update[]>({
    queryKey: ["/api/updates"],
  });

  const formatUpdateDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Posted today";
    } else if (diffDays === 1) {
      return "Posted yesterday";
    } else if (diffDays < 7) {
      return `Posted ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Posted ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Posted ${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  const getIconForUpdate = (update: Update) => {
    switch (update.iconName) {
      case 'bell':
        return <Bell className="h-5 w-5 text-white" />;
      case 'trophy':
        return <Trophy className="h-5 w-5 text-white" />;
      case 'star':
        return <Star className="h-5 w-5 text-white" />;
      default:
        return <Bell className="h-5 w-5 text-white" />;
    }
  };

  const getIconBackground = (update: Update) => {
    switch (update.type) {
      case 'announcement':
        return 'from-primary to-purple-600';
      case 'news':
        return 'from-pink-500 to-purple-600';
      case 'update':
        return 'from-cyan-400 to-primary';
      default:
        return 'from-primary to-purple-600';
    }
  };

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="font-orbitron text-2xl font-bold text-white mb-6">Latest Updates</h2>
        <Card className="p-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-700"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !updates || updates.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="font-orbitron text-2xl font-bold text-white mb-6">Latest Updates</h2>
        <Card className="p-6 text-center">
          <p className="text-white">No updates available at the moment.</p>
        </Card>
      </div>
    );
  }

  const visibleUpdates = updates.slice(0, displayCount);
  const hasMoreUpdates = updates.length > displayCount;

  return (
    <div className="mb-12">
      <h2 className="font-orbitron text-2xl font-bold text-white mb-6">Latest Updates</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {visibleUpdates.map((update, index) => (
              <div key={update.id} className={index !== 0 ? "border-t border-primary/20 pt-6" : ""}>
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r ${getIconBackground(update)} flex items-center justify-center`}>
                    {getIconForUpdate(update)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-orbitron font-medium text-white">{update.title}</p>
                    <p className="font-rajdhani text-gray-400 mt-1">{update.content}</p>
                    <div className="mt-2 text-sm font-rajdhani text-cyan-400 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {formatUpdateDate(update.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {hasMoreUpdates && (
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                className="font-rajdhani text-cyan-400 hover:text-pink-500 flex items-center mx-auto"
                onClick={() => setDisplayCount(prev => prev + 3)}
              >
                <span>Load More Updates</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
