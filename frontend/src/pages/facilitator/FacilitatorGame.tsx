import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Progress } from '../../components/ui/progress';
import { mockCardSets, mockPlayers, mockGroupSubmissions } from '../../data/mockData';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import AppBackground from '../AppBackground';

export default function FacilitatorGame() {
  const {  } = useParams();
  const [currentPhase, setCurrentPhase] = useState<'phase1' | 'phase2' | 'results'>('phase1');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);

  useEffect(() => {
    document.body.style.minHeight = '100svh';
    const root = document.getElementById('root');
    if (root) {
      root.style.borderInline = 'none';
      root.style.maxWidth = '100%';
      root.style.width = '100%';
      root.style.margin = '0';
    }
    return () => {
      document.body.style.minHeight = '';
      if (root) {
        root.style.borderInline = '';
        root.style.maxWidth = '';
        root.style.width = '';
        root.style.margin = '';
      }
    };
  }, []);

  const selectedSet = mockCardSets[0];
  const totalCards = selectedSet.cards.length;
  const currentCard = selectedSet.cards[currentCardIndex];

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setShowCard(false);
      setTimeout(() => { setCurrentCardIndex(currentCardIndex + 1); setShowCard(true); }, 300);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setShowCard(false);
      setTimeout(() => { setCurrentCardIndex(currentCardIndex - 1); setShowCard(true); }, 300);
    }
  };

  const groupsByColor = mockPlayers.reduce((acc, player) => {
    if (!acc[player.groupColor]) acc[player.groupColor] = [];
    acc[player.groupColor].push(player);
    return acc;
  }, {} as Record<string, typeof mockPlayers>);

  const groupDotColors: Record<string, string> = {
    BLUE: '#3b82f6', RED: '#ef4444', GREEN: '#22c55e', YELLOW: '#eab308',
  };

  const ghostBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '12px 24px', borderRadius: 12, border: '1.5px solid rgba(22,101,52,0.3)',
    background: 'rgba(255,255,255,0.7)', color: '#166534',
    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'background 0.15s',
  };

  return (
    <div className="min-h-screen" style={{
      position: 'relative',
      fontFamily: "'Georgia', serif",
      background: 'white',
    }}>

      <AppBackground />

      {/* Green overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(160deg, rgba(22,101,52,0.82) 0%, rgba(21,128,61,0.78) 50%, rgba(22,163,74,0.75) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      <main className="max-w-7xl mx-auto px-6 py-8" style={{ position: 'relative', zIndex: 2 }}>

        {/* PHASE 1 */}
        {currentPhase === 'phase1' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '1rem 1.5rem', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Phase 1 · Circle Time</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Card {currentCardIndex + 1} of {totalCards}</span>
              </div>
              <Progress value={(currentCardIndex + 1) / totalCards * 100} className="h-2" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '55vh' }}>
              <div style={{
                maxWidth: 760, width: '100%',
                background: 'rgba(255,255,255,0.97)', borderRadius: 24,
                padding: '4rem', textAlign: 'center',
                boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                opacity: showCard ? 1 : 0, transform: showCard ? 'scale(1)' : 'scale(0.96)',
                transition: 'opacity 0.3s, transform 0.3s',
              }}>
                <p style={{ fontSize: '3.2rem', lineHeight: 1.25, color: '#1c1917', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>
                  {currentCard.text}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button onClick={previousCard} disabled={currentCardIndex === 0}
                style={{ ...ghostBtn, opacity: currentCardIndex === 0 ? 0.4 : 1 }}>
                <ArrowLeft size={18} /> Previous
              </button>
              {currentCardIndex < totalCards - 1 ? (
                <button onClick={nextCard} style={{ ...ghostBtn, background: 'white', color: '#166534', border: 'none', fontWeight: 800, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                  Next Card <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={() => setCurrentPhase('phase2')} style={{ ...ghostBtn, background: '#4ade80', color: '#052e16', border: 'none', fontWeight: 800 }}>
                  Start Phase 2 <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHASE 2 */}
        {currentPhase === 'phase2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', marginBottom: 12, background: '#4ade80', color: '#052e16', fontSize: '0.8rem', fontWeight: 800, padding: '5px 14px', borderRadius: 20 }}>
                Phase 2 · Group Challenge
              </span>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Time for Group Work!</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>Players have been divided into groups. Each group should find a statement that applies to all members.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {Object.entries(groupsByColor).map(([color, players]) => (
                <div key={color} style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: groupDotColors[color] || '#9ca3af', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1c1917' }}>Group {players[0].groupId}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>{color}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {players.map(p => (
                      <div key={p.id} style={{ fontSize: '0.8rem', padding: '5px 8px', background: '#f9fafb', borderRadius: 7, color: '#374151' }}>{p.name}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.4)' }}>
              <p style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '1rem', color: '#1c1917' }}>Group Submissions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.keys(groupsByColor).map((color, i) => {
                  const submitted = mockGroupSubmissions.find(s => s.groupColor === color);
                  return (
                    <div key={color} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f9fafb', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: groupDotColors[color] || '#9ca3af' }} />
                        <span style={{ fontSize: '0.85rem', color: '#374151' }}>Group {i + 1} · {color}</span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: submitted ? '#f0fdf4' : '#f9fafb',
                        border: `1.5px solid ${submitted ? '#bbf7d0' : '#e5e7eb'}`,
                        color: submitted ? '#15803d' : '#9ca3af',
                      }}>
                        {submitted ? 'Submitted' : 'Waiting...'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => setCurrentPhase('results')} style={{ ...ghostBtn, background: '#4ade80', color: '#052e16', border: 'none', fontWeight: 800 }}>
                View Submissions <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {currentPhase === 'results' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', marginBottom: 12, background: '#4ade80', color: '#052e16', fontSize: '0.8rem', fontWeight: 800, padding: '5px 14px', borderRadius: 20 }}>
                Group Submissions
              </span>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>What We Have in Common</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockGroupSubmissions.map(sub => (
                <div key={sub.groupId} style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '1.75rem', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: groupDotColors[sub.groupColor] || '#9ca3af', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#1c1917' }}>Group {sub.groupId}</p>
                        <span style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{sub.groupColor}</span>
                      </div>
                      <p style={{ margin: '0 0 1rem', fontSize: '1.3rem', color: '#1c1917', fontStyle: 'italic', lineHeight: 1.4 }}>"{sub.statement}"</p>
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

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Link to="/facilitator/dashboard" style={{ textDecoration: 'none' }}>
                <button style={ghostBtn}>End Game</button>
              </Link>
              <button onClick={() => { setCurrentPhase('phase1'); setCurrentCardIndex(0); setShowCard(true); }}
                style={{ ...ghostBtn, background: '#4ade80', color: '#052e16', border: 'none', fontWeight: 800 }}>
                <RotateCcw size={16} /> Start New Round
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}