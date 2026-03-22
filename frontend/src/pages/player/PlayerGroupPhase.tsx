import { useState } from 'react';
import { useParams } from 'react-router';
import { mockPlayers } from '../../data/mockData';
import { Users, Send, CheckCircle2 } from 'lucide-react';
import AppBackground from '../AppBackground';

const GROUP_COLORS = {
  BLUE:   { dot: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  RED:    { dot: '#ef4444', light: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
  GREEN:  { dot: '#22c55e', light: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  YELLOW: { dot: '#eab308', light: '#fefce8', border: '#fef08a', text: '#a16207' },
};

export default function PlayerGroupPhase() {
  const { lobbyCode } = useParams();
  const [statement, setStatement] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const myGroupColor = 'BLUE';
  const myGroupId = 1;
  const myGroupMembers = mockPlayers.filter(p => p.groupColor === myGroupColor);
  const color = GROUP_COLORS[myGroupColor as keyof typeof GROUP_COLORS];

  const handleSubmit = () => { if (statement.trim()) setSubmitted(true); };

  const steps = [
    'Find each other in the room using your group color and number',
    'Discuss and discover what you all have in common',
    'Create a statement that\'s true for ALL group members',
    'Submit your statement using the form below',
  ];

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif", padding: '1rem' }}>

      <AppBackground />

      <div className="max-w-2xl mx-auto py-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ display: 'inline-block', background: color.light, border: `1.5px solid ${color.border}`, color: color.text, fontSize: '0.8rem', fontWeight: 700, padding: '5px 14px', borderRadius: 20, marginBottom: 12 }}>
            Phase 2 · Group Challenge
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1px', margin: '0 0 0.4rem' }}>Find Your Common Ground!</h1>
          <p style={{ fontSize: '0.95rem', color: '#78716c', margin: 0 }}>Work with your group to find a statement that applies to everyone</p>
        </div>

        {/* Group assignment */}
        <div style={{
          background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '1.75rem',
          border: `2px solid ${color.border}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.25rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: color.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>
              {myGroupId}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-0.5px' }}>Group {myGroupId}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>{myGroupColor}</p>
            </div>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '1rem 1.25rem' }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.82rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} /> Your Group Members
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {myGroupMembers.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '8px 10px', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: color.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '1rem', color: '#1c1917' }}>Your Mission</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: color.light, border: `1.5px solid ${color.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: color.text }}>
                  {i + 1}
                </span>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submission */}
        {!submitted ? (
          <div style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1.05rem', color: '#1c1917' }}>Submit Your Statement</p>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>Enter the statement your group agreed upon</p>
            <textarea
              placeholder="Example: We all love coffee and can't start the day without it"
              value={statement} onChange={e => setStatement(e.target.value)} rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, transition: 'border-color 0.15s', marginBottom: 8 }}
              onFocus={e => e.target.style.borderColor = color.dot}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#9ca3af' }}>Make sure everyone in your group agrees with this statement!</p>
            <button
              onClick={handleSubmit} disabled={!statement.trim()}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: statement.trim() ? color.dot : '#e5e7eb',
                color: statement.trim() ? 'white' : '#9ca3af',
                border: 'none', borderRadius: 14, padding: '16px', fontSize: '1rem', fontWeight: 800,
                cursor: statement.trim() ? 'pointer' : 'not-allowed',
                boxShadow: statement.trim() ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              <Send size={17} /> Submit for Group {myGroupId}
            </button>
          </div>
        ) : (
          <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 20, padding: '2.5rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} color="#15803d" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-0.5px', margin: '0 0 1.25rem' }}>Submission Complete!</h2>
            <div style={{ background: 'white', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Your group's statement</p>
              <p style={{ margin: 0, fontSize: '1.1rem', color: '#1c1917', fontStyle: 'italic', lineHeight: 1.5 }}>"{statement}"</p>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716c' }}>The facilitator will display all group statements on the projector soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}