import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Save, RefreshCw } from 'lucide-react';
import AppBackground from '../AppBackground';

export default function CreateCardSetAI() {
  const navigate = useNavigate();
  const [setName, setSetName] = useState('');
  const [category, setCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<string[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCards([
        "I've worked remotely for more than a year",
        "I prefer morning meetings over afternoon ones",
        "I've attended a professional conference",
        "I enjoy brainstorming sessions",
        "I've learned a new skill this year",
        "I have a daily routine that boosts my productivity",
        "I've mentored or been mentored by a colleague",
        "I celebrate small wins at work",
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => navigate('/facilitator/dashboard');

  const canGenerate = setName && category && prompt && !isGenerating;
  const canSave = generatedCards.length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>

      <AppBackground />

      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}>
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link to="/facilitator/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#15803d" />
            </div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
              Create with AI
            </h1>
          </div>
          <p style={{ color: '#78716c', fontSize: '1rem', margin: 0 }}>Let AI help you generate engaging card statements</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Setup card */}
          <div style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800, color: '#1c1917' }}>Card Set Details</h2>
            <p style={{ margin: '0 0 1.75rem', fontSize: '0.82rem', color: '#9ca3af' }}>Provide information about your card set</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Card Set Name <span style={{ color: '#16a34a' }}>*</span></label>
                <input placeholder="e.g., Professional Development" value={setName} onChange={e => setSetName(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Category <span style={{ color: '#16a34a' }}>*</span></label>
                <input placeholder="e.g., Workplace, Team Building" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>AI Prompt <span style={{ color: '#16a34a' }}>*</span></label>
              <textarea
                placeholder="Describe what kind of cards you want to generate. For example: 'Generate statements about professional development and career growth that office workers can relate to'"
                value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = '#4ade80'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              onClick={handleGenerate} disabled={!canGenerate}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: canGenerate ? 'linear-gradient(135deg, #278967 0%, #4ade80 100%)' : '#e5e7eb',
                color: canGenerate ? 'white' : '#9ca3af', border: 'none', borderRadius: 14,
                padding: '16px 28px', fontSize: '1rem', fontWeight: 800,
                cursor: canGenerate ? 'pointer' : 'not-allowed',
                boxShadow: canGenerate ? '0 8px 32px rgba(22,101,52,0.25)' : 'none',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { if (canGenerate) e.currentTarget.style.transform = 'scale(1.01)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isGenerating
                ? <><RefreshCw size={17} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                : <><Sparkles size={17} /> Generate Cards with AI</>
              }
            </button>
          </div>

          {/* Generated cards */}
          {generatedCards.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#1c1917' }}>Generated Cards</h2>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af' }}>Review your AI-generated cards</p>
                </div>
                <span style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  {generatedCards.length} cards
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {generatedCards.map((card, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 10, padding: '10px 14px' }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#15803d', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{card}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1.5px solid #f3f4f6' }}>
                <button onClick={handleSave} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)', color: 'white',
                  border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(22,101,52,0.25)',
                }}>
                  <Save size={16} /> Save Card Set
                </button>
                <button onClick={handleGenerate} disabled={isGenerating} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 20px', borderRadius: 12, border: '1.5px solid #e5e7eb',
                  background: 'white', fontSize: '0.95rem', fontWeight: 700, color: '#374151', cursor: 'pointer',
                }}>
                  <RefreshCw size={15} /> Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}