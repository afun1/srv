import React, { useState } from 'react';

interface VimeoUploadProps {
  videoBlob: Blob;
  onUploadSuccess: (videoUrl: string) => void;
}

const VIMEO_ACCESS_TOKEN = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

const VimeoUpload: React.FC<VimeoUploadProps> = ({ videoBlob, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    try {
      // Step 1: Get upload link from Vimeo
      const uploadSize = videoBlob.size;
      const vimeoRes = await fetch('https://api.vimeo.com/me/videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.vimeo.*+json;version=3.4',
        },
        body: JSON.stringify({
          upload: {
            approach: 'tus',
            size: uploadSize,
          },
          name: `Uploaded via React App (${new Date().toLocaleString()})`,
        }),
      });
      if (!vimeoRes.ok) throw new Error('Failed to get Vimeo upload link');
      const vimeoData = await vimeoRes.json();
      const uploadLink = vimeoData.upload.upload_link;
      const videoUri = vimeoData.uri;

      // Step 2: Upload video using TUS protocol (simple PATCH for small files)
      const tusRes = await fetch(uploadLink, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': '0',
          'Tus-Resumable': '1.0.0',
        },
        body: videoBlob,
      });
      if (!tusRes.ok) throw new Error('Failed to upload video to Vimeo');

      // Step 3: Get video URL
      const videoId = videoUri.split('/').pop();
      const videoUrl = `https://vimeo.com/${videoId}`;
      setUploading(false);
      onUploadSuccess(videoUrl);
    } catch (err: any) {
      setError('Upload failed: ' + (err.message || 'Unknown error'));
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '32px 0' }}>
      <button onClick={handleUpload} disabled={uploading} style={{ padding: '12px 32px', fontSize: 16, borderRadius: 4, background: '#28a745', color: '#fff', border: 'none', fontWeight: 600 }}>
        {uploading ? 'Uploading...' : 'Upload to Vimeo'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default VimeoUpload;
