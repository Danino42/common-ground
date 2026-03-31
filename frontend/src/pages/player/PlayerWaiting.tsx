import { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDrag } from '@use-gesture/react';
import { mockCardSets } from '../../data/mockData';
import AppBackground from '../AppBackground';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';

const ALL_CARDS = [
  // { id: 'c1',  text: "I've pulled an all-nighter studying" },
  // { id: 'c2',  text: "I've changed my major at least once" },
  // { id: 'c3',  text: "I've fallen asleep in a lecture" },
  // { id: 'c4',  text: "I joined a student club or society" },
  // { id: 'c5',  text: "I can speak more than two languages" },
  // { id: 'c6',  text: "I've lived abroad for more than a month" },
  // { id: 'c7',  text: "I love cooking at home" },
  // { id: 'c8',  text: "I prefer mountains over the beach" },
  // { id: 'c9',  text: "I've binge-watched a series in one weekend" },
  // { id: 'c10', text: "I play a musical instrument" }
  { id: 'c1',  text: "I support a universal basic income" },
  { id: 'c2',  text: "Climate change should be the #1 political priority" },
  { id: 'c3',  text: "Borders should be more open to immigration" },
  { id: 'c4',  text: "Wealthy people should pay significantly more taxes" },
  { id: 'c5',  text: "Social media does more harm than good to democracy" },
  { id: 'c6',  text: "The state should provide free university education" },
  { id: 'c7',  text: "Surveillance cameras in public spaces make us safer" },
  { id: 'c8',  text: "Nuclear energy is necessary for a green future" },
  { id: 'c9',  text: "Voting should be mandatory for all citizens" },
  { id: 'c10', text: "Corporations have too much political influence" }
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PlayerWaiting() {
  const { gameCode, cardSetId } = useParams();
  const cards = useMemo(() => {
    const set = mockCardSets.find(s => s.id === cardSetId) ?? mockCardSets[0];
    return shuffleArray(set.cards);
  }, [cardSetId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [justMounted, setJustMounted] = useState(false);

  const SWIPE_THRESHOLD = 90;
  const done = currentIndex >= cards.length;
  const currentCard = cards[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimatingOut) return;
    setIsAnimatingOut(true);
    setExitDirection(direction);
    setAnswers(prev => ({ ...prev, [currentCard.id]: direction === 'right' }));
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setExitDirection(null);
      setDragX(0);
      setDragY(0);
      setIsAnimatingOut(false);
      setJustMounted(true);
      setTimeout(() => setJustMounted(false), 50);
    }, 350);
  };

  const bind = useDrag(({ movement: [mx, my], last, velocity: [vx] }) => {
    if (isAnimatingOut) return;
    if (!last) {
      setDragX(mx);
      setDragY(my * 0.15);
      setIsDragging(true);
    } else {
      setIsDragging(false);
      const shouldSwipe = Math.abs(mx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.6;
      if (shouldSwipe) {
        handleSwipe(mx > 0 ? 'right' : 'left');
      } else {
        setDragX(0);
        setDragY(0);
      }
    }
  }, { axis: undefined });

  const rotation = dragX * 0.07;
  const swipeProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);
  const isRight = dragX > 15;
  const isLeft = dragX < -15;

  return (
    <div style={{
      minHeight: '100svh', background: 'white',
      fontFamily: "'Georgia', serif",
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <AppBackground />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem 1.5rem 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
          <img src={redImg} alt="" style={{ width: 18, height: 18, transform: 'rotate(-8deg)' }} />
          <img src={yellowImg} alt="" style={{ width: 18, height: 18 }} />
          <img src={greenImg} alt="" style={{ width: 18, height: 18, transform: 'rotate(8deg)' }} />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-0.5px' }}>
          Common Ground
        </h1>
        <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
          Code: <span style={{ fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>{gameCode}</span>
        </p>
      </div>

      {!done ? (
        <>
          {/* Progress bar */}
          <div style={{ position: 'relative', zIndex: 1, padding: '0.75rem 1.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.72rem', color: '#9ca3af' }}>
              <span>Which ones apply to you?</span>
              <span>{currentIndex + 1} / {cards.length}</span>
            </div>
            <div style={{ height: 4, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #278967, #4ade80)',
                width: `${(currentIndex / cards.length) * 100}%`,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {/* Swipe hint labels */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', justifyContent: 'space-between',
            padding: '0.5rem 2rem 0',
            maxWidth: 360, margin: '0 auto', width: '100%',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              color: isLeft ? '#ef4444' : '#d1d5db',
              fontSize: '0.82rem', fontWeight: 700,
              transition: 'color 0.15s',
              opacity: isLeft ? 0.6 + swipeProgress * 0.4 : 0.5,
            }}>
              <span style={{ fontSize: '1.1rem' }}>←</span> Nope
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              color: isRight ? '#22c55e' : '#d1d5db',
              fontSize: '0.82rem', fontWeight: 700,
              transition: 'color 0.15s',
              opacity: isRight ? 0.6 + swipeProgress * 0.4 : 0.5,
            }}>
              Yeah <span style={{ fontSize: '1.1rem' }}>→</span>
            </div>
          </div>

          {/* Card stack */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1, padding: '0.5rem 1.5rem',
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 340, height: 400 }}>

              {[2, 1].map((offset) => {
                const cardIndex = currentIndex + offset;
                if (cardIndex >= cards.length) return null;
                return (
                  <div key={cards[cardIndex].id} style={{
                    position: 'absolute', inset: 0,
                    background: offset === 2
                      ? '#f3f4f6'
                      : 'linear-gradient(145deg, #f9fafb 0%, #f0fdf4 100%)',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    borderRadius: 24,
                    transform: `translateY(${offset * 12}px) scale(${1 - offset * 0.05})`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    zIndex: offset === 1 ? 1 : 0,
                  }} />
                );
              })}

              {currentCard && (
                <div
                  {...bind()}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
                    border: '1.5px solid rgba(34,197,94,0.15)',
                    borderRadius: 24,
                    zIndex: 2,
                    boxShadow: isDragging
                      ? '0 24px 60px rgba(0,0,0,0.16)'
                      : '0 8px 32px rgba(0,0,0,0.09)',
                    transform: exitDirection
                      ? `translateX(${exitDirection === 'right' ? 700 : -700}px) rotate(${exitDirection === 'right' ? 22 : -22}deg)`
                      : `translateX(${dragX}px) translateY(${dragY}px) rotate(${rotation}deg)`,
                    transition: exitDirection
                      ? 'transform 0.35s ease-in'
                      : justMounted
                        ? 'none'
                        : isDragging
                          ? 'box-shadow 0.15s'
                          : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.15s',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    touchAction: 'none',
                    display: 'flex', flexDirection: 'column',
                    padding: '2rem',
                    overflow: 'hidden',
                  }}
                >
                  {/* NOPE stamp */}
                  <div style={{
                    position: 'absolute', top: 22, left: 20,
                    opacity: isLeft ? swipeProgress : 0,
                    transition: isDragging ? 'none' : 'opacity 0.15s',
                    transform: 'rotate(-18deg)',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      border: '3px solid #ef4444', borderRadius: 8,
                      padding: '3px 10px', color: '#ef4444',
                      fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.08em',
                    }}>NOPE</div>
                  </div>

                  {/* YEAH stamp */}
                  <div style={{
                    position: 'absolute', top: 22, right: 20,
                    opacity: isRight ? swipeProgress : 0,
                    transition: isDragging ? 'none' : 'opacity 0.15s',
                    transform: 'rotate(18deg)',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      border: '3px solid #22c55e', borderRadius: 8,
                      padding: '3px 10px', color: '#22c55e',
                      fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.08em',
                    }}>YEAH</div>
                  </div>

                  {/* Tint overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
                    background: isLeft
                      ? `rgba(239,68,68,${swipeProgress * 0.12})`
                      : isRight
                        ? `rgba(34,197,94,${swipeProgress * 0.12})`
                        : 'transparent',
                    transition: isDragging ? 'none' : 'background 0.15s',
                  }} />

                  {/* Card text */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{
                      fontSize: '1.45rem', fontWeight: 900, color: '#1c1917',
                      textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.3px',
                      margin: 0,
                    }}>
                      {currentCard.text}
                    </p>
                  </div>

                  {/* ✗ / ✓ buttons */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: '1rem' }}>
                    <button
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => handleSwipe('left')}
                      style={{
                        width: 48, height: 48, borderRadius: '50%',
                        border: '2px solid #fca5a5', background: '#fff5f5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '1.3rem', color: '#ef4444',
                        transition: 'transform 0.15s',
                        boxShadow: '0 2px 8px rgba(239,68,68,0.15)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >✗</button>
                    <button
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => handleSwipe('right')}
                      style={{
                        width: 48, height: 48, borderRadius: '50%',
                        border: '2px solid #86efac', background: '#f0fdf4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '1.3rem', color: '#22c55e',
                        transition: 'transform 0.15s',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >✓</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1, padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #278967, #4ade80)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', marginBottom: '1.25rem',
            boxShadow: '0 8px 32px rgba(22,101,52,0.3)',
          }}>✓</div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.7rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-0.5px' }}>
            All done!
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: 1.6 }}>
            Your answers have been recorded.<br />Waiting for the facilitator to start…
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: 16, padding: '1.25rem', width: '100%', maxWidth: 280,
            marginBottom: '1.5rem',
          }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.82rem', color: '#374151' }}>Your answers</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#22c55e' }}>
                  {Object.values(answers).filter(Boolean).length}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>Yeah</p>
              </div>
              <div style={{ width: 1, background: '#f3f4f6' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>
                  {Object.values(answers).filter(v => !v).length}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>Nope</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: '0.82rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
            Waiting for game to start...
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}