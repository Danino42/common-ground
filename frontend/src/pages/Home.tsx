import { Link } from 'react-router';
import { Users, User } from 'lucide-react';
import greenImg from '../images/green.png';
import redImg from '../images/red.png';
import yellowImg from '../images/yellow.png';
import AppBackground from './AppBackground';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      <AppBackground />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: '1.25rem' }}>
            <img src={redImg} alt="" style={{ width: 36, height: 36, transform: 'rotate(-8deg)' }} />
            <img src={yellowImg} alt="" style={{ width: 36, height: 36 }} />
            <img src={greenImg} alt="" style={{ width: 36, height: 36, transform: 'rotate(8deg)' }} />
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: '0 0 0.5rem', lineHeight: 1.05 }}>
            Common Ground
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#78716c', margin: 0 }}>Find what connects us</p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/facilitator/login" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
                color: 'white', border: 'none', borderRadius: 16,
                padding: '20px 28px', fontSize: '1.05rem', fontWeight: 800,
                cursor: 'pointer', letterSpacing: '-0.2px',
                boxShadow: '0 8px 32px rgba(22,101,52,0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(22,101,52,0.32)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,101,52,0.25)'; }}
            >
              <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.22)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              Facilitator Login
            </button>
          </Link>

          <Link to="/player/join" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'white', color: '#166534',
                border: '2px solid #bbf7d0', borderRadius: 16,
                padding: '20px 28px', fontSize: '1.05rem', fontWeight: 800,
                cursor: 'pointer', letterSpacing: '-0.2px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#bbf7d0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ width: 34, height: 34, background: '#f0fdf4', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#15803d" />
              </div>
              Join Game
            </button>
          </Link>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          An icebreaker activity to help groups connect
        </p>
      </div>
    </div>
  );
}