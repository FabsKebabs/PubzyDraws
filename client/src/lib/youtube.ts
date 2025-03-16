// Interface for YouTube video data
export interface YouTubeVideo {
  id: number;
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date;
  viewCount: number | null;
  fetchedAt: Date;
}

/**
 * Format view count to a human-readable format
 * @param viewCount The view count to format
 * @returns Formatted view count string (e.g., "1.2M", "5.4K")
 */
export function formatViewCount(viewCount: number | null): string {
  if (!viewCount) return "0 views";
  
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M views`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K views`;
  } else {
    return `${viewCount} views`;
  }
}

/**
 * Format published date to a relative time string
 * @param publishedAt The published date
 * @returns Relative time string (e.g., "2 days ago", "3 weeks ago")
 */
export function formatPublishedDate(publishedAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(publishedAt).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else if (diffWeeks > 0) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Get the YouTube video URL from a video ID
 * @param videoId The YouTube video ID
 * @returns The full YouTube video URL
 */
export function getYouTubeVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
