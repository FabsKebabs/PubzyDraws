import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Play, RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { formatViewCount, formatPublishedDate } from "@/lib/youtube";
import type { YouTubeVideo } from "@/lib/youtube";

export default function VideoGrid() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: videos, isLoading, error } = useQuery<YouTubeVideo[]>({
    queryKey: ["/api/videos"],
  });

  const refreshVideos = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.fetchQuery({ 
        queryKey: ["/api/videos"], 
        queryFn: async () => {
          const response = await fetch("/api/videos?refresh=true");
          if (!response.ok) throw new Error("Failed to refresh videos");
          return response.json();
        }
      });
    } catch (error) {
      console.error("Failed to refresh videos:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-800"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-orbitron text-red-500 mb-4">Failed to load videos</h3>
        <p className="text-gray-400 mb-6">There was an error loading the YouTube videos.</p>
        <Button onClick={refreshVideos} disabled={isRefreshing}>
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-orbitron text-white mb-4">No Videos Found</h3>
        <p className="text-gray-400 mb-6">Subscribe to our channel to see our latest content.</p>
        <Button onClick={refreshVideos} disabled={isRefreshing}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh Videos
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshVideos} 
          disabled={isRefreshing}
          className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> 
          {isRefreshing ? "Refreshing..." : "Refresh Videos"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="cyber-card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="relative">
              <img 
                src={video.thumbnailUrl || "https://via.placeholder.com/720x404"} 
                alt={video.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs font-rajdhani py-1 px-2 rounded-md flex items-center">
                <Eye className="h-3 w-3 mr-1" /> {formatViewCount(video.viewCount)}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-orbitron text-lg font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
              <p className="font-rajdhani text-gray-400 text-sm mb-4 line-clamp-2">{video.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 text-sm flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> {formatPublishedDate(video.publishedAt)}
                </span>
                <a 
                  href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black text-pink-500 hover:text-cyan-400 border border-pink-500 hover:border-cyan-400 rounded-md px-3 py-1 text-sm font-rajdhani transition-colors duration-300 flex items-center"
                >
                  <Play className="h-3 w-3 mr-1" /> Watch
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
