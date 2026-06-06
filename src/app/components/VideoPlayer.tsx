import React from 'react';

interface VideoPlayerProps {
  url: string;
  className?: string;
}

export function VideoPlayer({ url, className = '' }: VideoPlayerProps) {
  // Check if it's YouTube Shorts/Video, Vimeo, or a direct link
  const getEmbedUrl = (videoUrl: string) => {
    try {
      if (videoUrl.includes('youtube.com/shorts/')) {
        const id = videoUrl.split('/shorts/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (videoUrl.includes('youtube.com/watch')) {
        const id = new URL(videoUrl).searchParams.get('v');
        return `https://www.youtube.com/embed/${id}`;
      }
      if (videoUrl.includes('youtu.be/')) {
        const id = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (videoUrl.includes('vimeo.com/')) {
        // Handle standard vimeo and vimeo showcase/shorts
        const id = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${id}`;
      }
    } catch (e) {
      console.error('Error parsing video URL:', e);
    }
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className={`w-full h-full border-0 ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Testimonial"
      />
    );
  }

  // Fallback to native video element (e.g. direct MP4 URL)
  return (
    <video
      src={url}
      controls
      playsInline
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
