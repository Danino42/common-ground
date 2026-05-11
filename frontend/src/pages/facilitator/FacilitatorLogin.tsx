import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppBackground from '../AppBackground';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import { saveSession } from '../../utils/auth';
import { API_URL } from '../../utils/api';

type Step = 'email' | 'otp';

export default function FacilitatorLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const [joinCode, setJoinCode] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/facilitators/login/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to send code');
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/facilitators/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid code');
      saveSession(data.token, { email: data.email, username: data.username ?? '' });
      navigate('/facilitator/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s', background: 'white',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.83rem', fontWeight: 700,
    color: '#374151', marginBottom: 6,
  };

  const primaryBtn: React.CSSProperties = {
    width: '100%', padding: '13px', borderRadius: 12, border: 'none',
    background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
    color: loading ? '#9ca3af' : 'white',
    fontSize: '0.95rem', fontWeight: 800,
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: loading ? 'none' : '0 8px 32px rgba(22,101,52,0.25)',
    transition: 'transform 0.15s',
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <AppBackground />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: '1rem' }}>
            <img src={redImg} alt="" style={{ width: 28, height: 28, transform: 'rotate(-8deg)' }} />
            <img src={yellowImg} alt="" style={{ width: 28, height: 28 }} />
            <img src={greenImg} alt="" style={{ width: 28, height: 28, transform: 'rotate(8deg)' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1px', margin: '0 0 0.25rem', lineHeight: 1.1 }}>
            Facilitator Portal
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#78716c', margin: 0 }}>
            {step === 'email' ? 'Enter your email to get started' : 'Check your email for the code'}
          </p>
        </div>

        {/* Guest */}
        <button
          onClick={() => navigate('/facilitator/dashboard')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)', color: 'white', border: 'none', borderRadius: 16, padding: '18px 28px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 32px rgba(22,101,52,0.25)', transition: 'transform 0.15s, box-shadow 0.15s', marginBottom: '1rem' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(22,101,52,0.32)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,101,52,0.25)'; }}
        >
          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.22)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={yellowImg} alt="" style={{ width: 20, height: 20 }} />
          </div>
          Continue as Guest
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1.25rem' }}>
          No account needed — guest sessions are temporary
        </p>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          {error && (
            <div style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@example.com"
                  required
                  autoFocus
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
                <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>
                  We will send a 6-digit code to this address. If you do not have an account yet, one will be created automatically.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={primaryBtn}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
                  We sent a code to <strong style={{ color: '#1c1917' }}>{email.slice(0, 5)}...</strong>. It expires in 10 minutes.
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#fffbeb', border: '1.5px solid #fde68a',
                  borderRadius: 10, padding: '12px 14px', marginBottom: '1.25rem',
                }}>
                  <span style={{ fontSize: '0.85rem', lineHeight: '1', flexShrink: 0, marginTop: 1 }}>⚠️</span>
                  <span style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>
                    Also check your spam folder!
                  </span>
                </div>
                <label style={labelStyle}>6-digit code</label>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                  autoFocus
                  style={{ ...inputStyle, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.4em', textAlign: 'center', padding: '14px' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{ ...primaryBtn, background: (loading || otp.length !== 6) ? '#e5e7eb' : 'linear-gradient(135deg, #278967 0%, #4ade80 100%)', color: (loading || otp.length !== 6) ? '#9ca3af' : 'white', boxShadow: (loading || otp.length !== 6) ? 'none' : '0 8px 32px rgba(22,101,52,0.25)' }}
                onMouseEnter={e => { if (!loading && otp.length === 6) e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center' }}
              >
                Use a different email
              </button>
              <button
                type="button"
                onClick={() => { setOtp(''); setError(''); handleRequestOTP({ preventDefault: () => {} } as any); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center' }}
              >
                Resend code
              </button>
            </form>
          )}
        </div>
        {/* Join Game */}
        {/* <div style={{
          marginTop: '1.5rem',
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(0,0,0,0.07)',
          borderRadius: 20, padding: '1.75rem 2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>Join a Game</h2>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>Have a code? Jump straight in as a player.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Game code"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              maxLength={6}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: '1.5px solid #e5e7eb', fontSize: '1rem',
                fontWeight: 700, letterSpacing: '0.15em', textAlign: 'center',
                outline: 'none', fontFamily: 'monospace', color: '#15803d',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
              onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              onKeyDown={e => e.key === 'Enter' && joinCode.length > 0 && navigate(`/player/join?code=${joinCode}`)}
            />
            <button
              onClick={() => navigate(`/player/join?code=${joinCode}`)}
              disabled={joinCode.length === 0}
              style={{
                padding: '10px 20px', borderRadius: 12, border: 'none',
                background: joinCode.length > 0 ? 'linear-gradient(135deg, #278967 0%, #4ade80 100%)' : '#e5e7eb',
                color: joinCode.length > 0 ? 'white' : '#9ca3af',
                fontSize: '0.88rem', fontWeight: 700,
                cursor: joinCode.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
                boxShadow: joinCode.length > 0 ? '0 4px 12px rgba(21,128,61,0.25)' : 'none',
              }}
            >
              Join →
            </button>
          </div>
        </div> */}
      </div>
      
    </div>
  );
}