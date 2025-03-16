import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Play } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatViewCount, formatPublishedDate } from "@/lib/youtube";
import type { YouTubeVideo } from "@/lib/youtube";

export default function FeaturedContent() {
  const { data: videos, isLoading, error } = useQuery<YouTubeVideo[]>({
    queryKey: ["/api/videos"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-white">Featured Content</h2>
          <Link href="/videos" className="text-cyan-400 hover:text-pink-500 font-rajdhani flex items-center">
            View All <span className="ml-2">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      </div>
    );
  }

  if (error || !videos) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-white">Featured Content</h2>
          <Link href="/videos" className="text-cyan-400 hover:text-pink-500 font-rajdhani flex items-center">
            View All <span className="ml-2">→</span>
          </Link>
        </div>
        
        <Card className="p-6 text-center">
          <p className="text-red-500">Failed to load featured content. Please try again later.</p>
        </Card>
      </div>
    );
  }

  // Get 3 latest videos
  const featuredVideos = videos.slice(0, 3);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl font-bold text-white">Featured Content</h2>
        <Link href="/videos" className="text-cyan-400 hover:text-pink-500 font-rajdhani flex items-center">
          View All <span className="ml-2">→</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredVideos.map((video) => (
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
