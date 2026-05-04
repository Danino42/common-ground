import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import AppBackground from '../AppBackground';

type SavedSet = {
  id: number;
  name: string;
  cards: string[];
};

export default function CreateCardSet() {
  const navigate = useNavigate();

  const [setName, setSetName] = useState('');
  const [cards, setCards] = useState<string[]>(['', '', '']);
  const [lastDeleted, setLastDeleted] = useState<{ value: string; index: number } | null>(null);

  const [savedSets] = useState<SavedSet[]>([
    { id: 1, name: 'Icebreakers', cards: ['I love coffee', 'I hate Mondays', 'I enjoy hiking'] },
    { id: 2, name: 'Deep Talks', cards: ['Biggest fear?', 'Life goal?', 'Meaning of success?'] }
  ]);

  const [selectedSet, setSelectedSet] = useState<SavedSet | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1.5px solid #e5e7eb',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit'
  };

  const addCard = () => setCards([...cards, '']);

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setLastDeleted({ value: cards[index], index });
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    const newCards = [...cards];
    newCards.splice(lastDeleted.index, 0, lastDeleted.value);
    setCards(newCards);
    setLastDeleted(null);
  };

  const updateCard = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index] = value;
    setCards(newCards);
  };

  const toggleSelectCard = (card: string) => {
    setSelectedCards(prev =>
      prev.includes(card) ? prev.filter(c => c !== card) : [...prev, card]
    );
  };

  const importSelectedCards = () => {
    setCards([...cards, ...selectedCards]);
    setSelectedCards([]);
  };

  const generateAICards = () => {
    const generated = Array.from({ length: 10 }, (_, i) => `AI generated card ${i + 1}`);
    setCards([...cards, ...generated]);
  };

  const canSave = setName && cards.some(c => c.trim());

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>
      <AppBackground />

      {/* HEADER */}
      <header style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="max-w-5xl mx-auto px-6 py-3">
          <Link to="/facilitator/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#15803d',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main
        className="max-w-5xl mx-auto px-6 py-10"
        style={{
          display: 'flex',
          gap: '2rem',
          position: 'relative',
          zIndex: 1
        }}
      >

        {/* LEFT */}
        <div style={{ flex: 2 }}>

          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontSize: '2.6rem',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              margin: 0
            }}>
              Create Card Set
            </h1>
            <p style={{ color: '#78716c', marginTop: 8 }}>
              Build a custom deck for your session
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(0,0,0,0.06)',
            borderRadius: 20,
            padding: '2rem',
            boxShadow: '0 6px 28px rgba(0,0,0,0.04)'
          }}>

            {/* NAME */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
                Deck Name
              </label>
              <input
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="e.g., Office Icebreakers"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4ade80'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* AI */}
            <div style={{
              marginBottom: '1.75rem',
              padding: '1.2rem',
              borderRadius: 16,
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0'
            }}>
              <p style={{ fontSize: '0.85rem', marginBottom: 8, color: '#166534', fontWeight: 600 }}>
                Generate cards with AI
              </p>
              <input
                placeholder="Fill up my deck with diverse cards matching my theme..."
                style={{ ...inputStyle, marginBottom: 10 }}
              />
              <button
                onClick={generateAICards}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a, #4ade80)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Sparkles size={14} /> Create 10 Cards
              </button>
            </div>

            {/* CARDS */}
            <div style={{ marginBottom: '1rem' }}>
              {cards.map((card, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <span style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {index + 1}
                  </span>

                  <input
                    value={card}
                    onChange={(e) => updateCard(index, e.target.value)}
                    placeholder="Write a card..."
                    style={{ ...inputStyle, flex: 1 }}
                  />

                  <button
                    onClick={() => removeCard(index)}
                    style={{
                      border: 'none',
                      background: '#fff5f5',
                      borderRadius: 8,
                      padding: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>

            {/* ACTION ROW */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={addCard}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1.5px dashed #bbf7d0',
                  background: '#f0fdf4',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add Card
              </button>

              {lastDeleted && (
                <button
                  onClick={undoDelete}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} /> Undo
                </button>
              )}
            </div>

            {/* SAVE */}
            <div style={{ marginTop: '2rem' }}>
              <button
                disabled={!canSave}
                onClick={() => navigate('/facilitator/dashboard')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  fontWeight: 800,
                  background: canSave
                    ? 'linear-gradient(135deg, #278967, #4ade80)'
                    : '#e5e7eb',
                  color: canSave ? 'white' : '#9ca3af',
                  cursor: canSave ? 'pointer' : 'not-allowed'
                }}
              >
                <Save size={16} /> Save Card Set
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.85)',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: 20,
          padding: '1.5rem',
          boxShadow: '0 6px 28px rgba(0,0,0,0.04)',
          height: 'fit-content'
        }}>
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Browse Saved Sets</h3>

          {savedSets.map(set => (
            <div
              key={set.id}
              onClick={() => setSelectedSet(set)}
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 6,
                background: selectedSet?.id === set.id ? '#f0fdf4' : 'transparent'
              }}
            >
              {set.name}
            </div>
          ))}

          {selectedSet && (
            <>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                Select cards to import
              </div>

              <div style={{ marginTop: 8 }}>
                {selectedSet.cards.map((card, i) => (
                  <div
                    key={i}
                    onClick={() => toggleSelectCard(card)}
                    style={{
                      padding: '8px',
                      borderRadius: 10,
                      marginBottom: 6,
                      cursor: 'pointer',
                      border: selectedCards.includes(card)
                        ? '1.5px solid #4ade80'
                        : '1.5px solid #f3f4f6',
                      background: selectedCards.includes(card)
                        ? '#f0fdf4'
                        : 'white'
                    }}
                  >
                    {card}
                  </div>
                ))}
              </div>

              <button
                onClick={importSelectedCards}
                style={{
                  marginTop: '0.75rem',
                  width: '100%',
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#15803d',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Take selected cards
              </button>
            </>
          )}
        </div>

      </main>
    </div>
  );
}