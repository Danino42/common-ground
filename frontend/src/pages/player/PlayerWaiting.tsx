import { useParams, useNavigate } from 'react-router';
import { Clock, Users } from 'lucide-react';
import AppBackground from '../AppBackground';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';

export default function PlayerWaiting() {
  const { lobbyCode } = useParams();
  const navigate = useNavigate();

  const startGroupPhase = () => {
    navigate(`/player/group-phase/${lobbyCode}`);
  };

  const steps = [
    'Listen to each statement shown on the screen',
    'Step into the center if it applies to you',
    'Acknowledge others who stepped in with you',
    'Step back to the circle for the next card',
  ];

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      <AppBackground />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: '1rem' }}>
            <img src={redImg} alt="" style={{ width: 28, height: 28, transform: 'rotate(-8deg)' }} />
            <img src={yellowImg} alt="" style={{ width: 28, height: 28 }} />
            <img src={greenImg} alt="" style={{ width: 28, height: 28, transform: 'rotate(8deg)' }} />
          </div>
        </div>

        {/* Main card */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(0,0,0,0.07)',
          borderRadius: 24, padding: '2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>

          {/* Phase badge */}
          <span style={{
            display: 'inline-block', marginBottom: '1.5rem',
            background: '#f0fdf4', border: '1.5px solid #bbf7d0',
            color: '#15803d', fontSize: '0.8rem', fontWeight: 700,
            padding: '5px 14px', borderRadius: 20, letterSpacing: '0.03em',
          }}>
            Phase 1 · Circle Time
          </span>

          {/* Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#f0fdf4', border: '2px solid #bbf7d0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Users size={36} color="#15803d" />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1px', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
            Game in Progress
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#78716c', margin: '0 0 2rem' }}>
            The facilitator is showing cards on the projector.
          </p>

          {/* Steps */}
          <div style={{
            background: '#f9fafb', borderRadius: 14,
            padding: '1.25rem 1.5rem', marginBottom: '2rem',
            textAlign: 'left',
          }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>What to do:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: '#15803d',
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9ca3af', marginBottom: '2rem' }}>
            <Clock size={15} />
            <span style={{ fontSize: '0.85rem' }}>Waiting for group phase to begin...</span>
          </div>

          {/* Dev helper */}
          <button
            onClick={startGroupPhase}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 10,
              border: '1.5px solid #e5e7eb', background: 'white',
              fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer',
            }}
          >
            Simulate: Start Group Phase
          </button>
        </div>
      </div>
    </div>
  );
}