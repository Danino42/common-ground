import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Users } from 'lucide-react';
import { card, outlineBtn, primaryBtn } from './gameStyles';
import GroupingView from './GroupingView';

interface Player {
  player_id: string;
  name: string;
  finished: boolean;
}

interface Props {
  results: Record<string, { yes: number; no: number }>;
  cards: { id: string; text: string }[];
  currentResultIndex: number;
  setCurrentResultIndex: React.Dispatch<React.SetStateAction<number>>;
  resultsBlurred: boolean;
  setResultsBlurred: React.Dispatch<React.SetStateAction<boolean>>;
  players: Player[];
  playerAnswers: Record<string, Record<string, boolean>>;
  gameCode: string;
}

export default function SwipeResultsView({
  results, cards, currentResultIndex, setCurrentResultIndex,
  resultsBlurred, setResultsBlurred, players, playerAnswers,
  gameCode
}: Props) {
  const [phase, setPhase] = useState<'results' | 'grouping'>('results');

  const resultCard = cards[currentResultIndex];
  const cardResults = resultCard ? (results[resultCard.id] || { yes: 0, no: 0 }) : { yes: 0, no: 0 };
  const total = cardResults.yes + cardResults.no;
  const yesPercent = total > 0 ? Math.round((cardResults.yes / total) * 100) : 0;
  const noPercent = total > 0 ? Math.round((cardResults.no / total) * 100) : 0;
  const totalCards = cards.length;
  const isLastCard = currentResultIndex === totalCards - 1;
  const totalParticipants = players.length;

  if (phase === 'grouping') {
    return (
      <GroupingView
        players={players}
        answers={playerAnswers}
        onBack={() => setPhase('results')}
        gameCode={gameCode}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Results</p>
          <p style={{ margin: '2px 0 0', fontWeight: 800, color: '#1c1917', fontSize: '1rem' }}>
            Card {currentResultIndex + 1} of {totalCards}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setResultsBlurred(b => !b)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 10,
              border: '1.5px solid #e5e7eb',
              background: resultsBlurred ? '#1c1917' : 'white',
              color: resultsBlurred ? 'white' : '#374151',
              fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {resultsBlurred ? <EyeOff size={13} /> : <Eye size={13} />}
            {resultsBlurred ? 'Show Results' : 'Hide Results'}
          </button>
          {/* responses / participants badge */}
          <span style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
            {total} / {totalParticipants} responded
          </span>
        </div>
      </div>

      {/* Card text */}
      <div style={{
        ...card, textAlign: 'center', padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, #fafafa 0%, #f0fdf4 100%)',
        height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1c1917', margin: 0, lineHeight: 1.3, letterSpacing: '-0.5px' }}>
          {resultCard?.text}
        </p>
      </div>

      {/* Charts */}
      <div style={{ ...card }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {[
            { label: 'Yeah', value: cardResults.yes, pct: yesPercent, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', bar: 'linear-gradient(180deg, #86efac, #22c55e)' },
            { label: 'Nope', value: cardResults.no, pct: noPercent, color: '#b91c1c', bg: '#fff5f5', border: '#fca5a5', bar: 'linear-gradient(180deg, #fca5a5, #ef4444)' },
          ].map(({ label, value, pct, color, bg, border, bar }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              {/* taller (220px) bar container */}
              <div style={{ height: 220, background: bg, borderRadius: 14, position: 'relative', overflow: 'hidden', border: `1.5px solid ${border}` }}>

                {/* filled bar */}
                {!resultsBlurred && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, background: bar, borderRadius: '12px 12px 0 0', transition: 'height 0.6s ease' }} />
                )}

                {/* blur overlay — covers the full rectangle */}
                {resultsBlurred && (
                  <>
                        <div style={{ position: 'absolute', inset: 0, background: bar }} />
                        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', background: `${bg}cc` }} />
                    </>
                )}

                {/* numbers */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {!resultsBlurred ? (
                    <>
                      <span style={{ fontSize: '3rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color, opacity: 0.7 }}>{pct}%</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color, opacity: 0.9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>hidden</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: '1rem 0 0', textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
          {total} {total === 1 ? 'response' : 'responses'}
        </p>
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button
          onClick={() => setCurrentResultIndex(i => Math.max(0, i - 1))}
          disabled={currentResultIndex === 0}
          style={{ ...outlineBtn, opacity: currentResultIndex === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <button
          onClick={() => setCurrentResultIndex(i => Math.min(totalCards - 1, i + 1))}
          disabled={isLastCard}
          style={{ ...primaryBtn, opacity: isLastCard ? 0.4 : 1 }}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>

      {/* Form Groups */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setPhase('grouping')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 12,
            border: '1.5px solid #e9d5ff',
            background: '#faf5ff', color: '#7c3aed',
            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#faf5ff'; e.currentTarget.style.color = '#7c3aed'; }}
        >
          <Users size={16} /> Form Groups
        </button>
      </div>

    </div>
  );
}