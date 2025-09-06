import React, { useRef, useState } from 'react';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err: any) {
      setError('Could not access camera/microphone.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ textAlign: 'center', margin: '32px 0' }}>
      <video ref={videoRef} autoPlay muted style={{ width: 400, maxWidth: '100%', borderRadius: 8, background: '#222' }} />
      <div style={{ marginTop: 16 }}>
        {!recording ? (
          <button onClick={startRecording} style={{ padding: '12px 32px', fontSize: 16, borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600 }}>
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} style={{ padding: '12px 32px', fontSize: 16, borderRadius: 4, background: '#e53935', color: '#fff', border: 'none', fontWeight: 600 }}>
            Stop Recording
          </button>
        )}
      </div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default VideoRecorder;
