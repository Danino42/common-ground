import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Mail, LogOut } from 'lucide-react';
import AppBackground from '../AppBackground';
import { getUser, clearSession } from '../../utils/auth';

export default function FacilitatorProfile() {
  const navigate = useNavigate();
  const sessionUser = getUser();
  const email = sessionUser?.email ?? '';

  const handleLogout = () => {
    clearSession();
    navigate('/facilitator/login');
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)',
    borderRadius: 20, padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
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
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>Profile</h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Your account details</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 520 }}>

          {/* Avatar */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Profile Picture</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>
                {email?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.83rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}>
                  Upload Picture
                </button>
                <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>Square image, at least 200x200px</p>
              </div>
            </div>
          </div>

          {/* Account */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Account</h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>Your account is identified by your email address</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
              <Mail size={16} color="#9ca3af" />
              <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>{email || 'Not signed in'}</span>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.5 }}>
              To sign in from a new device, request a code to this email address on the login page.
            </p>
          </div>

          {/* Sign out */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Sign Out</h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>Your card sets and saved data will be preserved for next time you sign in</p>
            <button
              onClick={handleLogout}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: '1.5px solid #fca5a5', background: '#fff5f5', color: '#b91c1c', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}