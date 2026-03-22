import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import AppBackground from '../AppBackground';


export default function CreateCardSet() {
  const navigate = useNavigate();
  const [setName, setSetName] = useState('');
  const [category, setCategory] = useState('');
  const [cards, setCards] = useState(['', '', '']);

  const addCard = () => setCards([...cards, '']);

  const removeCard = (index:number) => {
    if (cards.length > 1) setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index:number, value:string) => {
    const newCards = [...cards];
    newCards[index] = value;
    setCards(newCards);
  };

  const handleSave = () => navigate('/facilitator/dashboard');

  const canSave = setName && category && cards.some(c => c.trim());

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s'
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>

      <AppBackground />

      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)'
      }}>
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link to="/facilitator/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none'
          }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>

        {/* Page title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
            Create Card Set
          </h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Build a custom card set for your game</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.85)',
          border: '1.5px solid rgba(0,0,0,0.07)',
          borderRadius: 20,
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800, color: '#1c1917' }}>Card Set Details</h2>
          <p style={{ margin: '0 0 1.75rem', fontSize: '0.82rem', color: '#9ca3af' }}>Give your card set a name and category</p>

          {/* Name + Category row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Card Set Name <span style={{ color: '#16a34a' }}>*</span>
              </label>
              <input
                placeholder="e.g., Office Icebreakers"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4ade80'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Category <span style={{ color: '#16a34a' }}>*</span>
              </label>
              <input
                placeholder="e.g., Workplace, Hobbies, Travel"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4ade80'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1.5px solid #f3f4f6', paddingTop: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#1c1917' }}>Cards</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>Add statements for your participants</p>
              </div>
              <span style={{
                background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                color: '#15803d', fontSize: '0.75rem', fontWeight: 700,
                padding: '3px 10px', borderRadius: 20
              }}>
                {cards.length} cards
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
              {cards.map((card, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Card number pill */}
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: '#15803d', flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <input
                    placeholder={`e.g., "I love traveling"`}
                    value={card}
                    onChange={(e) => updateCard(index, e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = '#4ade80'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    onClick={() => removeCard(index)}
                    disabled={cards.length === 1}
                    style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      border: '1.5px solid #fee2e2', background: '#fff5f5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: cards.length === 1 ? 'not-allowed' : 'pointer',
                      opacity: cards.length === 1 ? 0.4 : 1,
                      transition: 'all 0.15s'
                    }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCard}
              style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: '1.5px dashed #bbf7d0', background: '#f0fdf4',
                fontSize: '0.85rem', fontWeight: 700, color: '#15803d',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.borderColor = '#4ade80'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
            >
              <Plus size={15} /> Add Another Card
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1.5px solid #f3f4f6' }}>
            <button
              onClick={handleSave}
              disabled={!canSave}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: canSave ? 'linear-gradient(135deg, #278967 0%, #4ade80 100%)' : '#e5e7eb',
                color: canSave ? 'white' : '#9ca3af',
                border: 'none', borderRadius: 12,
                padding: '14px 24px', fontSize: '0.95rem', fontWeight: 800,
                cursor: canSave ? 'pointer' : 'not-allowed',
                boxShadow: canSave ? '0 8px 32px rgba(22,101,52,0.25)' : 'none',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => { if (canSave) e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Save size={16} /> Save Card Set
            </button>
            <button
              onClick={() => navigate('/facilitator/dashboard')}
              style={{
                padding: '14px 24px', borderRadius: 12,
                border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '0.95rem', fontWeight: 700, color: '#374151', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}