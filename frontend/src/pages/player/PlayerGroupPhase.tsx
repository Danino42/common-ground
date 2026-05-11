import { useParams } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import AppBackground from '../AppBackground';

export default function PlayerGroupPhase() {
  const { } = useParams();

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", padding: '1rem' }}>
      <AppBackground />
      <div className="max-w-2xl mx-auto py-8" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={36} color="#15803d" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1px', margin: '0 0 0.75rem' }}>
          You're in a group!
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#78716c', margin: 0, lineHeight: 1.6 }}>
          Your facilitator will announce the groups shortly. Look around the room for your group members!
        </p>
      </div>
    </div>
  );
}