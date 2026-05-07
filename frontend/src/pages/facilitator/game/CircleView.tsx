import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { outlineBtn, primaryBtn } from './gameStyles';

interface Props {
  cards: { id: string; text: string }[];
  results: Record<string, { yes: number; no: number }>;
  resultsBlurred: boolean;
  setResultsBlurred: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CircleView({ cards }: Props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);

  const totalCards = cards.length;
  const currentCard = cards[currentCardIndex];

  const [isAnimating, setIsAnimating] = useState(false);

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1 && !isAnimating) {
      setIsAnimating(true);
      setShowCard(false);
      setTimeout(() => {
        setCurrentCardIndex(i => i + 1);
        setShowCard(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setShowCard(false);
      setTimeout(() => {
        setCurrentCardIndex(i => i - 1);
        setShowCard(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#9ca3af', fontFamily: "'Georgia', serif" }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Waiting for game to start...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, padding: '0 0.25rem' }}>
        <span>Card {currentCardIndex + 1} of {totalCards}</span>
        <span>{Math.round((currentCardIndex + 1) / totalCards * 100)}%</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: 99,
          background: 'linear-gradient(90deg, #b45309, #fbbf24)',
          width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Card */}
      <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #fde68a',
          borderRadius: 24,
          minHeight: '38vh',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 8rem',
          textAlign: 'center',
          boxShadow: '0 12px 48px rgba(180,83,9,0.1)',
          opacity: showCard ? 1 : 0,
          transform: showCard ? 'scale(1)' : 'scale(0.97)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}>
        <p style={{
          fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
          fontWeight: 900,
          color: '#1c1917',
          margin: 0,
          lineHeight: 1.25,
          letterSpacing: '-1px',
          fontFamily: "'Georgia', serif",
        }}>
          {currentCard?.text}
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={previousCard}
          disabled={currentCardIndex === 0}
          style={{ ...outlineBtn, opacity: currentCardIndex === 0 ? 0.4 : 1, padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={18} /> Previous
        </button>
        <button
          onClick={nextCard}
          disabled={currentCardIndex === totalCards - 1}
          style={{ ...primaryBtn, background: 'linear-gradient(135deg, #b45309, #d97706)', opacity: currentCardIndex === totalCards - 1 ? 0.4 : 1, padding: '12px 24px', fontSize: '0.95rem' }}
        >
          Next <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}