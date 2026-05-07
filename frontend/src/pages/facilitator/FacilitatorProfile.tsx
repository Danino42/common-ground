import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Mail, LogOut, User, Check } from 'lucide-react';
import AppBackground from '../AppBackground';
import { getUser, clearSession, saveSession, authHeaders, getToken, isLoggedIn } from '../../utils/auth';
import { API_URL } from '../../utils/api';

export default function FacilitatorProfile() {
  const navigate = useNavigate();
  const sessionUser = getUser();
  const email = sessionUser?.email ?? '';
  const loggedIn = isLoggedIn();

  const [username, setUsername] = useState(sessionUser?.username ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const displayName = username.trim() || email.slice(0, 5);

  const handleLogout = () => {
    clearSession();
    navigate('/facilitator/login');
  };

  const handleSaveUsername = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/facilitators/me`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ username: username.trim() }),
      });
      if (!res.ok) throw new Error('Failed to save');
      saveSession(getToken() ?? '', { email, username: username.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Could not save username. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)',
    borderRadius: 20, padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s',
    background: 'white',
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>
      <AppBackground />

      <header style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
        <div className="max-w-4xl mx-auto px-6 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/facilitator/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #fca5a5', background: '#fff5f5', color: '#b91c1c', fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <LogOut size={14} /> {loggedIn ? 'Log Out' : 'Exit'}
          </button>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1.5rem' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>Profile</h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem', margin: '8px 0 0' }}>Your account details</p>
        </div>

        {/* Top row: Display Name + Account */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: loggedIn ? '1fr 1fr' : '1fr',
          gap: '1.25rem',
          width: '100%',
          maxWidth: loggedIn ? 680 : 360,
          marginBottom: '1.25rem',
        }}>

          {/* Display Name — logged in only */}
          {loggedIn && (
            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Display Name</h2>
              <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5 }}>
                Shown on decks you publish. Defaults to first 5 characters of your email.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, marginBottom: '0.85rem' }}>
                <User size={12} color="#15803d" />
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                  Preview: <strong>{displayName}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={email.slice(0, 5)}
                  maxLength={30}
                  style={{ ...inputStyle, fontSize: '0.85rem', padding: '9px 12px' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                  onKeyDown={e => e.key === 'Enter' && handleSaveUsername()}
                />
                <button
                  onClick={handleSaveUsername}
                  disabled={saving}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                    padding: '9px 14px', borderRadius: 10,
                    border: saved ? '1.5px solid #bbf7d0' : 'none',
                    background: saved ? '#f0fdf4' : '#15803d',
                    color: saved ? '#15803d' : 'white',
                    fontSize: '0.82rem', fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {saved ? <><Check size={13} /> Saved</> : saving ? '...' : 'Save'}
                </button>
              </div>
              {error && <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>{error}</p>}
            </div>
          )}

          {/* Account */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Account</h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>
              {loggedIn ? 'Your account is identified by your email address' : 'You are browsing as a guest'}
            </p>
            {loggedIn ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
                  <Mail size={16} color="#9ca3af" />
                  <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>{email}</span>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.5 }}>
                  To sign in from a new device, request a code to this email address on the login page.
                </p>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
                <User size={16} color="#9ca3af" />
                <span style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: 600 }}>Guest session</span>
              </div>
            )}
          </div>
        </div>

        {/* Sign out — narrow and centered */}
        <div style={{ ...cardStyle, textAlign: 'center', width: '100%', maxWidth: 340 }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>
            {loggedIn ? 'Sign Out' : 'Exit Guest Session'}
          </h2>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>
            {loggedIn
              ? 'Your card sets and saved data will be preserved for next time you sign in'
              : 'Guest sessions are temporary — your data may not be preserved'}
          </p>
          <button
            onClick={handleLogout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, border: '1.5px solid #fca5a5', background: '#fff5f5', color: '#b91c1c', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.borderColor = '#fca5a5'; }}
          >
            <LogOut size={15} /> {loggedIn ? 'Sign Out' : 'Exit'}
          </button>
        </div>

      </main>
    </div>
  );
}