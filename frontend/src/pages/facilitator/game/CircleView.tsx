import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Progress } from '../../../components/ui/progress';
import { card, outlineBtn, primaryBtn, pillBtn } from './gameStyles';

interface Props {
  cards: { id: string; text: string }[];
  results: Record<string, { yes: number; no: number }>;
  resultsBlurred: boolean;
  setResultsBlurred: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CircleView({ cards, results, resultsBlurred, setResultsBlurred }: Props) {
  const [currentPhase, setCurrentPhase] = useState<'cards' | 'results'>('cards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);

  const totalCards = cards.length;
  const currentCard = cards[currentCardIndex];
  const resultCard = cards[currentResultIndex];
  const cardResults = resultCard ? (results[resultCard.id] || { yes: 0, no: 0 }) : { yes: 0, no: 0 };
  const total = cardResults.yes + cardResults.no;
  const yesPercent = total > 0 ? Math.round((cardResults.yes / total) * 100) : 0;
  const noPercent = total > 0 ? Math.round((cardResults.no / total) * 100) : 0;

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setShowCard(false);
      setTimeout(() => { setCurrentCardIndex(i => i + 1); setShowCard(true); }, 300);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setShowCard(false);
      setTimeout(() => { setCurrentCardIndex(i => i - 1); setShowCard(true); }, 300);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div style={{ ...card, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={pillBtn(currentPhase === 'cards', '#b45309')} onClick={() => setCurrentPhase('cards')}>Cards</button>
          <button style={pillBtn(currentPhase === 'results', '#b45309')} onClick={() => setCurrentPhase('results')}>Results</button>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>Circle Mode · Offline</span>
      </div>

      {currentPhase === 'cards' && (
        <>
          <div style={{ ...card, padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>
              <span>Card {currentCardIndex + 1} of {totalCards}</span>
              <span>{Math.round((currentCardIndex + 1) / totalCards * 100)}%</span>
            </div>
            <Progress value={(currentCardIndex + 1) / totalCards * 100} className="h-2" />
          </div>

          <div style={{
            ...card, textAlign: 'center', minHeight: '50vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '4rem 3rem',
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1.5px solid #fde68a',
            opacity: showCard ? 1 : 0, transform: showCard ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: '#1c1917', margin: 0, lineHeight: 1.25, letterSpacing: '-1px' }}>
              {currentCard?.text}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button onClick={previousCard} disabled={currentCardIndex === 0} style={{ ...outlineBtn, opacity: currentCardIndex === 0 ? 0.4 : 1 }}>
              <ArrowLeft size={16} /> Previous
            </button>
            {currentCardIndex < totalCards - 1 ? (
              <button onClick={nextCard} style={primaryBtn}>Next <ArrowRight size={16} /></button>
            ) : (
              <button onClick={() => setCurrentPhase('results')} style={{ ...primaryBtn, background: '#b45309' }}>
                View Results <ArrowRight size={16} />
              </button>
            )}
          </div>
        </>
      )}

      {currentPhase === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
            <p style={{ margin: 0, fontWeight: 800, color: '#1c1917' }}>Card {currentResultIndex + 1} of {totalCards}</p>
            <button
              onClick={() => setResultsBlurred(b => !b)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: resultsBlurred ? '#1c1917' : 'white', color: resultsBlurred ? 'white' : '#374151', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {resultsBlurred ? <EyeOff size={13} /> : <Eye size={13} />}
              {resultsBlurred ? 'Show' : 'Hide'}
            </button>
          </div>

          <div style={{ ...card, textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1.5px solid #fde68a' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1c1917', margin: 0, lineHeight: 1.3 }}>{resultCard?.text}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Yeah', value: cardResults.yes, pct: yesPercent, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', bar: 'linear-gradient(180deg, #86efac, #22c55e)' },
              { label: 'Nope', value: cardResults.no, pct: noPercent, color: '#ef4444', bg: '#fff5f5', border: '#fca5a5', bar: 'linear-gradient(180deg, #fca5a5, #ef4444)' },
            ].map(({ label, value, pct, color, bg, border, bar }) => (
              <div key={label} style={{ ...card, textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <div style={{ height: 120, background: bg, borderRadius: 12, position: 'relative', overflow: 'hidden', border: `1.5px solid ${border}`, filter: resultsBlurred ? 'blur(12px)' : 'none', transition: 'filter 0.4s ease' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, background: bar, borderRadius: '10px 10px 0 0', transition: 'height 0.6s ease' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color, opacity: 0.7 }}>{pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button onClick={() => setCurrentResultIndex(i => Math.max(0, i - 1))} disabled={currentResultIndex === 0} style={{ ...outlineBtn, opacity: currentResultIndex === 0 ? 0.4 : 1 }}>
              <ArrowLeft size={16} /> Previous
            </button>
            <button onClick={() => setCurrentResultIndex(i => Math.min(totalCards - 1, i + 1))} disabled={currentResultIndex === totalCards - 1} style={{ ...primaryBtn, opacity: currentResultIndex === totalCards - 1 ? 0.4 : 1 }}>
              Next <ArrowRight size={16} />
            </button>
          </div>
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