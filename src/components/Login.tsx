import React, { useState } from 'react';
import { login } from '../auth';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      onLogin(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '80px auto', padding: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #0001' }}>
      <h2 style={{ marginBottom: 24 }}>Sign In</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
        autoFocus
      />
      <button type="submit" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600 }}>
        Sign In
      </button>
    </form>
  );
};

export default Login;
