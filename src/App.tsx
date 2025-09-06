import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import VideoRecorder from './components/VideoRecorder';
import VimeoUpload from './components/VimeoUpload';
import VideoList from './components/VideoList';
// ...existing code...
import { getCurrentUser, logout } from './auth';


const VIMEO_ACCESS_TOKEN = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(getCurrentUser());
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [localVideos, setLocalVideos] = useState<{ url: string; title?: string }[]>([]);
  const [vimeoVideos, setVimeoVideos] = useState<{ url: string; title?: string }[]>([]);
  const [loadingVimeo, setLoadingVimeo] = useState(false);
  const [vimeoError, setVimeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchVimeoVideos = async () => {
      setLoadingVimeo(true);
      setVimeoError(null);
      try {
        const res = await fetch('https://api.vimeo.com/me/videos', {
          headers: {
            'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
            'Accept': 'application/vnd.vimeo.*+json;version=3.4',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVimeoVideos(
          (data.data || []).map((v: any) => ({
            url: v.link,
            title: v.name,
          }))
        );
      } catch (err: any) {
        setVimeoError('Could not load Vimeo videos: ' + (err.message || 'Unknown error'));
      }
      setLoadingVimeo(false);
    };
    fetchVimeoVideos();
  }, [user]);

  const handleLogin = (username: string) => setUser(username);
  const handleLogout = () => {
    logout();
    setUser(null);
    setRecordedBlob(null);
  };
  const handleRecordingComplete = (blob: Blob) => setRecordedBlob(blob);
  const handleUploadSuccess = (videoUrl: string) => {
    setLocalVideos([{ url: videoUrl }, ...localVideos]);
    setRecordedBlob(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa' }}>
      <header style={{ padding: 24, background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>Vimeo Video Uploader</div>
        <div>
          <span style={{ marginRight: 16 }}>Hi, {user}</span>
          <button onClick={handleLogout} style={{ background: 'none', color: '#fff', border: '1px solid #fff', borderRadius: 4, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
        </div>
      </header>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        {recordedBlob && (
          <VimeoUpload videoBlob={recordedBlob} onUploadSuccess={handleUploadSuccess} />
        )}
        <VideoList
          videos={[...localVideos, ...vimeoVideos]}
          loadingVimeo={loadingVimeo}
          vimeoError={vimeoError}
        />
      </main>
    </div>
  );
};

export default App;
