import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Progress } from '../../components/ui/progress';
import { mockCardSets, mockPlayers, mockGroupSubmissions } from '../../data/mockData';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import AppBackground from '../AppBackground';
import { API_URL } from '../../utils/api';

export default function FacilitatorGame() {
  const { lobbyCode } = useParams();
  const [currentPhase, setCurrentPhase] = useState<'phase1' | 'phase2' | 'results'>('phase1');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [results, setResults] = useState<Record<string, { yes: number; no: number }>>({});

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

  // Poll results every 3 seconds
  useEffect(() => {
    if (!lobbyCode) return;
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${lobbyCode}/results`);
        const data = await res.json();
        setResults(data.results || {});
      } catch {}
    };
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, [lobbyCode]);

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

  // Results card view
  const ResultsView = () => {
    const card = selectedSet.cards[currentResultIndex];
    const cardResults = results[card.id] || { yes: 0, no: 0 };
    const total = cardResults.yes + cardResults.no;
    const yesPercent = total > 0 ? Math.round((cardResults.yes / total) * 100) : 0;
    const noPercent = total > 0 ? Math.round((cardResults.no / total) * 100) : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header bar */}
        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '1rem 1.5rem', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Live Results · Swipe Mode</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            Card {currentResultIndex + 1} of {totalCards}
          </span>
        </div>

        {/* Card + chart */}
        <div style={{
          background: 'rgba(255,255,255,0.97)', borderRadius: 24,
          padding: '3rem', textAlign: 'center',
          boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
        }}>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: '#1c1917', margin: '0 0 2.5rem', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
            {card.text}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* YES bar */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#15803d' }}>YEAH</p>
              <div style={{ height: 140, background: '#f0fdf4', borderRadius: 14, position: 'relative', overflow: 'hidden', border: '1.5px solid #bbf7d0' }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${yesPercent}%`,
                  background: 'linear-gradient(180deg, #4ade80, #15803d)',
                  borderRadius: '12px 12px 0 0',
                  transition: 'height 0.6s ease',
                }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#15803d' }}>{cardResults.yes}</span>
                </div>
              </div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '1.3rem', fontWeight: 900, color: '#15803d' }}>{yesPercent}%</p>
            </div>

            {/* NO bar */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#ef4444' }}>NOPE</p>
              <div style={{ height: 140, background: '#fff5f5', borderRadius: 14, position: 'relative', overflow: 'hidden', border: '1.5px solid #fca5a5' }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${noPercent}%`,
                  background: 'linear-gradient(180deg, #f87171, #ef4444)',
                  borderRadius: '12px 12px 0 0',
                  transition: 'height 0.6s ease',
                }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ef4444' }}>{cardResults.no}</span>
                </div>
              </div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '1.3rem', fontWeight: 900, color: '#ef4444' }}>{noPercent}%</p>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af' }}>
            {total} {total === 1 ? 'response' : 'responses'} · updates every 3s
          </p>
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={() => setCurrentResultIndex(i => Math.max(0, i - 1))}
            disabled={currentResultIndex === 0}
            style={{ ...ghostBtn, opacity: currentResultIndex === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={18} /> Previous
          </button>
          <button
            onClick={() => setCurrentResultIndex(i => Math.min(totalCards - 1, i + 1))}
            disabled={currentResultIndex === totalCards - 1}
            style={{ ...ghostBtn, background: 'white', color: '#166534', border: 'none', fontWeight: 800, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', opacity: currentResultIndex === totalCards - 1 ? 0.4 : 1 }}
          >
            Next <ArrowRight size={18} />
          </button>
        </div>

        {/* End game */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Link to="/facilitator/dashboard" style={{ textDecoration: 'none' }}>
            <button style={ghostBtn}>End Game</button>
          </Link>
          <button
            onClick={() => { setCurrentPhase('phase1'); setCurrentCardIndex(0); setShowCard(true); setCurrentResultIndex(0); }}
            style={{ ...ghostBtn, background: '#4ade80', color: '#052e16', border: 'none', fontWeight: 800 }}
          >
            <RotateCcw size={16} /> New Round
          </button>
        </div>
      </div>
    );
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

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/facilitator/dashboard" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', textDecoration: 'none' }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Common Ground</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>Code: {lobbyCode}</p>
            </div>
          </div>

          {/* Phase switcher */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['phase1', 'phase2', 'results'] as const).map((phase) => (
              <button
                key={phase}
                onClick={() => setCurrentPhase(phase)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: currentPhase === phase ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  color: currentPhase === phase ? '#166534' : 'rgba(255,255,255,0.8)',
                  fontSize: '0.78rem', fontWeight: 700,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.15s',
                }}
              >
                {phase === 'phase1' ? 'Circle' : phase === 'phase2' ? 'Groups' : 'Results'}
              </button>
            ))}
          </div>
        </div>
      </header>

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
                View Results <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {currentPhase === 'results' && <ResultsView />}

      </main>
    </div>
  );
}