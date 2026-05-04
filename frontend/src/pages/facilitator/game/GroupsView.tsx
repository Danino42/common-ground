import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { mockPlayers, mockGroupSubmissions } from '../../../data/mockData';
import { card, outlineBtn, primaryBtn, pillBtn } from './gameStyles';

export default function GroupsView() {
  const [currentPhase, setCurrentPhase] = useState<'groups' | 'results'>('groups');

  const groupsByColor = mockPlayers.reduce((acc, player) => {
    if (!acc[player.groupColor]) acc[player.groupColor] = [];
    acc[player.groupColor].push(player);
    return acc;
  }, {} as Record<string, typeof mockPlayers>);

  const groupDotColors: Record<string, string> = {
    BLUE: '#3b82f6', RED: '#ef4444', GREEN: '#22c55e', YELLOW: '#eab308',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div style={{ ...card, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={pillBtn(currentPhase === 'groups', '#7c3aed')} onClick={() => setCurrentPhase('groups')}>Groups</button>
          <button style={pillBtn(currentPhase === 'results', '#7c3aed')} onClick={() => setCurrentPhase('results')}>Submissions</button>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>Random Groups Mode</span>
      </div>

      {currentPhase === 'groups' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {Object.entries(groupsByColor).map(([color, players]) => (
              <div key={color} style={{ ...card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: groupDotColors[color] || '#9ca3af', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1c1917' }}>Group {players[0].groupId}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>{color}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {players.map(p => (
                    <div key={p.id} style={{ fontSize: '0.8rem', padding: '5px 8px', background: '#f9fafb', borderRadius: 7, color: '#374151', fontWeight: 600 }}>{p.name}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...card }}>
            <p style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '0.95rem', color: '#1c1917' }}>Group Submissions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.keys(groupsByColor).map((color, i) => {
                const submitted = mockGroupSubmissions.find(s => s.groupColor === color);
                return (
                  <div key={color} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: groupDotColors[color] || '#9ca3af' }} />
                      <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>Group {i + 1}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: submitted ? '#f0fdf4' : '#f3f4f6', border: `1.5px solid ${submitted ? '#bbf7d0' : '#e5e7eb'}`, color: submitted ? '#15803d' : '#9ca3af' }}>
                      {submitted ? '✓ Submitted' : 'Waiting...'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setCurrentPhase('results')} style={primaryBtn}>
              View Submissions <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}

      {currentPhase === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockGroupSubmissions.map(sub => (
            <div key={sub.groupId} style={{ ...card }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: groupDotColors[sub.groupColor] || '#9ca3af', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#1c1917' }}>Group {sub.groupId}</p>
                    <span style={{ background: '#f3f4f6', color: '#6b7280', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{sub.groupColor}</span>
                  </div>
                  <p style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: '#1c1917', fontStyle: 'italic', lineHeight: 1.4 }}>"{sub.statement}"</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {sub.members.map(m => (
                      <span key={m} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/facilitator/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ ...outlineBtn, color: '#9ca3af', fontSize: '0.82rem' }}>End Game</button>
        </Link>
      </div>
    </div>
  );
}