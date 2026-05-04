import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Users } from 'lucide-react';
import AppBackground from '../AppBackground';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import { API_URL } from '../../utils/api';

export default function PlayerJoin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const codeFromUrl = searchParams.get('code') || '';

  const [gameCode, setGameCode] = useState(codeFromUrl);
  const [playerName, setPlayerName] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/games/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lobby_code: gameCode, name: playerName }),
      });
      const data = await res.json();
      // data.player_id = "SYZZXL-met"
      navigate(`/player/waiting/${gameCode}/${data.player_id}`);
    } catch {
      const fallbackId = `${gameCode}-${playerName}`;
      navigate(`/player/waiting/${gameCode}/${fallbackId}`);
    }
  };

  const canJoin = gameCode.trim().length > 0 && playerName.trim().length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s', background: 'white',
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      <AppBackground />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

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
            Join Game
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#78716c', margin: 0 }}>Enter the code provided by your facilitator</p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(0,0,0,0.07)',
          borderRadius: 20, padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Game Code
              </label>
              <input
                type="text"
                placeholder="ABCDEF"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                maxLength={6}
                required
                style={{
                  ...inputStyle,
                  fontSize: '1.8rem', textAlign: 'center',
                  letterSpacing: '0.2em', fontWeight: 900,
                  padding: '14px', color: '#166534',
                }}
                onFocus={e => e.target.style.borderColor = '#4ade80'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4ade80'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={!canJoin}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: canJoin ? 'linear-gradient(135deg, #278967 0%, #4ade80 100%)' : '#e5e7eb',
                color: canJoin ? 'white' : '#9ca3af',
                border: 'none', borderRadius: 14,
                padding: '18px 28px', fontSize: '1.05rem', fontWeight: 800,
                cursor: canJoin ? 'pointer' : 'not-allowed',
                boxShadow: canJoin ? '0 8px 32px rgba(22,101,52,0.25)' : 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
                marginTop: '0.25rem',
              }}
              onMouseEnter={e => { if (canJoin) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(22,101,52,0.32)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = canJoin ? '0 8px 32px rgba(22,101,52,0.25)' : 'none'; }}
            >
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.22)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={17} />
              </div>
              Join Game
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: '#9ca3af' }}>
          No registration required — just your code and name.
        </p>
      </div>
    </div>
  );
}