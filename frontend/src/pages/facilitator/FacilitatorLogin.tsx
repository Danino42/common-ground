import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import AppBackground from '../AppBackground';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';

export default function FacilitatorLogin() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/facilitator/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/facilitator/dashboard');
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
    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
    color: 'white', fontSize: '0.95rem', fontWeight: 800,
    cursor: 'pointer', boxShadow: '0 8px 32px rgba(22,101,52,0.25)',
    transition: 'transform 0.15s',
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      <AppBackground />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

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
          <p style={{ fontSize: '0.9rem', color: '#78716c', margin: 0 }}>Login or create an account to get started</p>
        </div>

        {/* Guest access */}
        <button
          onClick={() => navigate('/facilitator/dashboard')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
            color: 'white', border: 'none', borderRadius: 16,
            padding: '20px 28px', fontSize: '1.05rem', fontWeight: 800,
            cursor: 'pointer', letterSpacing: '-0.2px',
            boxShadow: '0 8px 32px rgba(22,101,52,0.25)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            marginBottom: '1rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(22,101,52,0.32)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,101,52,0.25)'; }}
        >
          <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.22)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={yellowImg} alt="" style={{ width: 20, height: 20 }} />
          </div>
          Continue as Guest
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1.25rem' }}>
          No account needed — guest sessions are temporary and won't be saved
        </p>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>or sign in</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <Tabs defaultValue="login">
            <TabsList style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: 4, marginBottom: '1.5rem' }}>
              <TabsTrigger value="login" style={{ borderRadius: 9, padding: '8px', fontSize: '0.875rem', fontWeight: 700 }}>Login</TabsTrigger>
              <TabsTrigger value="register" style={{ borderRadius: 9, padding: '8px', fontSize: '0.875rem', fontWeight: 700 }}>Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <button type="submit" style={{ ...primaryBtn, marginTop: '0.25rem' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  Login
                </button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" placeholder="John Doe" value={registerName} onChange={e => setRegisterName(e.target.value)} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder="your@email.com" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" placeholder="••••••••" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <button type="submit" style={{ ...primaryBtn, marginTop: '0.25rem' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  Create Account
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}