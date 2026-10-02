import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useDrag } from '@use-gesture/react';
import AppBackground from '../AppBackground';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SHAPES = ['circle', 'square', 'triangle', 'star', 'blob'];
const COLORS = ['#15803d', '#0369a1', '#7c3aed', '#b45309', '#be185d', '#0f766e', '#c2410c'];

export default function PlayerWaiting() {
  const { gameCode, playerId } = useParams();

  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<{ id: string; text: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // one_by_one mode
  const [oneByOne, setOneByOne] = useState(false);
  const [facilitatorCardIndex, setFacilitatorCardIndex] = useState(0);

  // Waiting screen interactive shape
  const [shapeIndex, setShapeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [shapeSize, setShapeSize] = useState(180);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTap = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShapeSize(s => s * 0.7);
    setTimeout(() => {
      setShapeIndex(i => (i + 1) % SHAPES.length);
      setColorIndex(i => (i + Math.floor(Math.random() * COLORS.length - 1) + 1) % COLORS.length);
      setTapCount(c => c + 1);
      setShapeSize(180);
      setIsAnimating(false);
    }, 200);
  }, [isAnimating]);

  // Poll for game start + one_by_one index
  useEffect(() => {
    if (!gameCode) return;
    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${gameCode}`);
        const data = await res.json();

        if (data.status === 'started' && !gameStarted) {
          const rawCards = data.cards || [];
          setCards(data.randomize_deck ? shuffleArray(rawCards) : rawCards);
          setOneByOne(data.one_by_one || false);
          setFacilitatorCardIndex(data.current_card_index ?? 0);
          setGameStarted(true);
        }

        if (data.one_by_one && gameStarted) {
          setFacilitatorCardIndex(data.current_card_index ?? 0);
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [gameCode, gameStarted]);

  const SWIPE_THRESHOLD = 90;
  const done = currentIndex >= cards.length;
  const currentCard = cards[currentIndex];

  // Mark finished
  useEffect(() => {
    if (done && playerId && gameCode) {
      const timer = setTimeout(() => {
        fetch(`${API_URL}/games/${gameCode}/player/${encodeURIComponent(playerId)}/finished`, {
          method: 'PATCH',
        }).catch(() => {});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [done]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isAnimatingOut) return;
    if (oneByOne && currentIndex > facilitatorCardIndex) return;

    setIsAnimatingOut(true);
    setExitDirection(direction);
    const answer = direction === 'right';

    if (currentCard && playerId && gameCode) {
      try {
        await fetch(`${API_URL}/games/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lobby_code: gameCode, player_id: playerId, card_id: currentCard.id, answer }),
        });
      } catch {}
    }

    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setDragX(0);
      setDragY(0);
      setExitDirection(null);
      setIsAnimatingOut(false);
    }, 350);
  };

  const bind = useDrag(({ movement: [mx, my], last, velocity: [vx] }) => {
  if (oneByOne && currentIndex > facilitatorCardIndex) return;
    setDragX(mx);
    setDragY(my * 0.2);
    setIsDragging(!last);
    if (last) {
      const shouldSwipe = Math.abs(mx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.5;
      if (shouldSwipe) {
        handleSwipe(mx > 0 ? 'right' : 'left');
      } else {
        setDragX(0);
        setDragY(0);
      }
    }
  });

  const rotation = isAnimatingOut ? 0 : dragX * 0.08;
  const opacity = isAnimatingOut ? 0 : 1;
  const exitX = exitDirection === 'right' ? 600 : exitDirection === 'left' ? -600 : dragX;
  const swipeProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);
  const isYeah = dragX > 30;
  const isNope = dragX < -30;

  const shape = SHAPES[shapeIndex];
  const color = COLORS[colorIndex];

  const renderShape = () => {
    const size = shapeSize;
    const style: React.CSSProperties = {
      width: size, height: size,
      background: color,
      cursor: 'pointer',
      transition: isAnimating ? 'all 0.2s ease' : 'none',
      userSelect: 'none',
    };
    if (shape === 'circle') return <div style={{ ...style, borderRadius: '50%' }} onClick={handleTap} />;
    if (shape === 'square') return <div style={{ ...style, borderRadius: 24 }} onClick={handleTap} />;
    if (shape === 'blob') return <div style={{ ...style, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} onClick={handleTap} />;
    if (shape === 'triangle') return (
      <div onClick={handleTap} style={{ cursor: 'pointer' }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill={color} />
        </svg>
      </div>
    );
    if (shape === 'star') return (
      <div onClick={handleTap} style={{ cursor: 'pointer' }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={color} />
        </svg>
      </div>
    );
  };

  // ── Waiting screen ─────────────────────────────────────────────
  if (!gameStarted) {
    return (
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', position: 'relative', overflow: 'hidden' }}>
        <AppBackground />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <img src={redImg} alt="" style={{ width: 28, height: 28, transform: 'rotate(-10deg)' }} />
            <img src={yellowImg} alt="" style={{ width: 28, height: 28 }} />
            <img src={greenImg} alt="" style={{ width: 28, height: 28, transform: 'rotate(10deg)' }} />
          </div>
          <div style={{ transition: 'transform 0.2s ease', transform: isAnimating ? 'scale(0.7)' : 'scale(1)' }}>
            {renderShape()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-0.5px' }}>
              Getting ready...
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#9ca3af', fontWeight: 500 }}>
              The facilitator will start the game shortly
            </p>
            {tapCount > 0 && (
              <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: color, fontWeight: 700 }}>
                {tapCount} {tapCount === 1 ? 'tap' : 'taps'} ✨
              </p>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#d1d5db', fontWeight: 500 }}>
            tap the shape while you wait
          </p>
        </div>
      </div>
    );
  }

  // ── One by one waiting screen ──────────────────────────────────
  if (oneByOne && !done && currentIndex > facilitatorCardIndex) {
    return (
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', position: 'relative' }}>
        <AppBackground />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontWeight: 900, color: '#1c1917', fontSize: '1.4rem', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Waiting for the next card...
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', margin: 0 }}>
            The facilitator will reveal the next card shortly
          </p>
        </div>
      </div>
    );
  }

  // ── Done screen ────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', position: 'relative' }}>
        <AppBackground />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: '2rem' }}>
            <img src={redImg} alt="" style={{ width: 36, height: 36, transform: 'rotate(-10deg)' }} />
            <img src={yellowImg} alt="" style={{ width: 36, height: 36 }} />
            <img src={greenImg} alt="" style={{ width: 36, height: 36, transform: 'rotate(10deg)' }} />
          </div>
          <p style={{ fontWeight: 900, color: '#1c1917', fontSize: '1.8rem', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            All done!
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
            Your answers have been submitted.<br />Wait for the facilitator to continue.
          </p>
        </div>
      </div>
    );
  }

  // ── Swipe screen ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
      <AppBackground />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

        {/* Progress */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>{currentIndex + 1} / {cards.length}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>{Math.round(((currentIndex) / cards.length) * 100)}%</span>
          </div>
          <div style={{ height: 5, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #15803d, #4ade80)', width: `${(currentIndex / cards.length) * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Cards stack */}
        <div style={{ position: 'relative', width: '100%', height: 340 }}>
          {/* Background cards */}
          {[2, 1].map(offset => {
            const idx = currentIndex + offset;
            if (idx >= cards.length) return null;
            return (
              <div key={idx} style={{ position: 'absolute', inset: 0, background: 'white', border: '2px solid #e5e7eb', borderRadius: 24, transform: `scale(${1 - offset * 0.04}) translateY(${offset * 10}px)`, zIndex: 10 - offset, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }} />
            );
          })}

          {/* Active card */}
          <style>{`
            @keyframes cardEnter {
              from { transform: translateY(70px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
          <div
            key={currentCard?.id ?? currentIndex}
            {...bind()}
            style={{
              position: 'absolute', inset: 0,
              background: isYeah
                ? `rgba(240,253,244,${0.5 + swipeProgress * 0.5})`
                : isNope
                  ? `rgba(255,245,245,${0.5 + swipeProgress * 0.5})`
                  : 'white',
              border: `2px solid ${isYeah ? '#bbf7d0' : isNope ? '#fca5a5' : '#e5e7eb'}`,
              borderRadius: 24,
              zIndex: 20,
              cursor: 'grab',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
              transform: `translate(${exitX}px, ${dragY}px) rotate(${rotation}deg)`,
              transition: isAnimatingOut ? 'transform 0.35s ease, opacity 0.35s ease' : isDragging ? 'none' : 'transform 0.3s ease',
              animation: 'cardEnter 0.35s ease-out',
              opacity,
              touchAction: 'none',
            }}
          >
            {/* Yeah indicator */}
            {isYeah && (
              <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 14px', borderRadius: 20, background: '#15803d', color: 'white', fontWeight: 900, fontSize: '0.85rem', opacity: swipeProgress, transform: `rotate(-15deg)`, letterSpacing: '0.05em' }}>
                YEAH ✓
              </div>
            )}
            {/* Nope indicator */}
            {isNope && (
              <div style={{ position: 'absolute', top: 20, right: 20, padding: '6px 14px', borderRadius: 20, background: '#dc2626', color: 'white', fontWeight: 900, fontSize: '0.85rem', opacity: swipeProgress, transform: `rotate(15deg)`, letterSpacing: '0.05em' }}>
                NOPE ✗
              </div>
            )}
            <p style={{ fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', fontWeight: 800, color: '#1c1917', margin: 0, lineHeight: 1.3, letterSpacing: '-0.3px' }}>
              {currentCard?.text}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', justifyContent: 'center' }}>
          <button
            onClick={() => handleSwipe('left')}
            style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #fca5a5', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.6rem', boxShadow: '0 4px 16px rgba(239,68,68,0.15)', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#fff5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'white'; }}
          >
            ✗
          </button>
          <button
            onClick={() => handleSwipe('right')}
            style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #bbf7d0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.6rem', boxShadow: '0 4px 16px rgba(21,128,61,0.15)', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#f0fdf4'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'white'; }}
          >
            ✓
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.72rem', color: '#d1d5db', fontWeight: 500 }}>
          swipe or tap to answer
        </p>
      </div>
    </div>
  );
}