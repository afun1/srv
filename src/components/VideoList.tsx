import React from 'react';


interface VideoListProps {
  videos: { url: string; title?: string }[];
  loadingVimeo?: boolean;
  vimeoError?: string | null;
}

const VideoList: React.FC<VideoListProps> = ({ videos, loadingVimeo, vimeoError }) => {
  if (loadingVimeo) return <div style={{ textAlign: 'center', margin: 32 }}>Loading Vimeo videos...</div>;
  if (vimeoError) return <div style={{ color: 'red', textAlign: 'center', margin: 32 }}>{vimeoError}</div>;
  if (videos.length === 0) return <div style={{ textAlign: 'center', margin: 32, color: '#888' }}>No videos uploaded or found in your Vimeo account.</div>;
  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 24 }}>All Recordings</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {videos.map((video, idx) => (
          <div key={video.url + (video.title || idx)} style={{ width: 320, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16 }}>
            <iframe
              src={video.url.replace('vimeo.com/', 'player.vimeo.com/video/')}
              width="288"
              height="162"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={video.title || `Video ${idx + 1}`}
              style={{ borderRadius: 6, marginBottom: 12 }}
            ></iframe>
            <div style={{ fontWeight: 600 }}>{video.title || `Video ${idx + 1}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
