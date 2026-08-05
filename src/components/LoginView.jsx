import React, { useState } from 'react';

export default function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'librarian' && password === 'ecc_uc_2026') {
      setError('');
      onLogin(username);
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-badge">ECC</div>
          <h2>ECC Department Library</h2>
          <p>Union Christian (UC) College, Aluva</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Librarian Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="e.g. librarian"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="password">Security Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            Sign In to Dashboard
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
          Authorized access only. Project developed for SDLC Assignment.
        </div>
      </div>
    </div>
  );
}
