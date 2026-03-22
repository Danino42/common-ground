import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, User, Mail, Lock, Save } from 'lucide-react';
import AppBackground from '../AppBackground';

export default function FacilitatorProfile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const canUpdatePassword = currentPassword && newPassword && newPassword === confirmPassword;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s', background: 'white',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6,
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)',
    borderRadius: 20, padding: '1.75rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  };

  const saveBtn = (disabled = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '11px 22px', borderRadius: 12, border: 'none',
    background: disabled ? '#e5e7eb' : 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
    color: disabled ? '#9ca3af' : 'white',
    fontSize: '0.875rem', fontWeight: 800,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 6px 20px rgba(22,101,52,0.2)',
    transition: 'transform 0.15s',
  });

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>

      <AppBackground />

      <header style={{
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}>
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link to="/facilitator/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>Profile Settings</h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Manage your account information</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Avatar */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Profile Picture</h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>Update your profile picture</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', fontWeight: 900, color: 'white',
              }}>
                JD
              </div>
              <div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.83rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}>
                  Upload New Picture
                </button>
                <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>Recommended: Square image, at least 200×200px</p>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Personal Information</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: '#9ca3af' }}>Update your name and email</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}><User size={13} /> Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}><Mail size={13} /> Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <button style={saveBtn()}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Password */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Change Password</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: '#9ca3af' }}>Update your password to keep your account secure</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}><Lock size={13} /> Current Password</label>
                <input type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <button disabled={!canUpdatePassword} style={saveBtn(!canUpdatePassword)}>
                  <Lock size={14} /> Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
            borderRadius: 20, padding: '1.75rem',
            boxShadow: '0 20px 60px rgba(22,101,52,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-30px', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 800, color: 'white', position: 'relative', zIndex: 1 }}>Account Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', position: 'relative', zIndex: 1 }}>
              {[
                { value: '8', label: 'Card Sets Created' },
                { value: '23', label: 'Games Hosted' },
                { value: '456', label: 'Total Players' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '1rem' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{stat.value}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}