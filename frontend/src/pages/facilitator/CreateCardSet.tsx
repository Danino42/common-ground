import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  ArrowLeft, Plus, Trash2, Save, RotateCcw, Sparkles,
  ChevronDown, ChevronUp, Check, Upload
} from 'lucide-react';
import AppBackground from '../AppBackground';
import { cardSetsApi } from '../../utils/api';
import type { CardSet } from '../../utils/api';
import { isLoggedIn } from '../../utils/auth';
import { getLocalSavedIds } from '../../utils/savedSets';
import SessionBadge from '../../components/SessionBadge';
import { API_URL } from '../../utils/api';



interface CardItem { id: string; text: string; }

function generateId() { return `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

const numCircle: React.CSSProperties = {
  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
  background: '#f3f4f6', border: '1.5px solid #e5e7eb',
  fontSize: '0.7rem', fontWeight: 700, color: '#1c1917',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const MAX_UNDO = 5;

export default function CreateCardSet() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // The set being edited, loaded from backend
  const [editSet, setEditSet] = useState<CardSet | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  // isCopy = editing a premade/system set → creates a new set, not overwriting
  // isEdit = editing own user set → updates in place
  const [isCopy, setIsCopy] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [setName, setSetName] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<CardItem[]>([
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
  ]);
  const [undoStack, setUndoStack] = useState<{ card: CardItem; index: number }[]>([]);

  // AI
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Browse panel — saved sets loaded from backend
  const [browseSets, setBrowseSets] = useState<CardSet[]>([]);
  const [expandedBrowseId, setExpandedBrowseId] = useState<string | null>(null);
  const [selectedImportCards, setSelectedImportCards] = useState<string[]>([]);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Import feedback
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // Load the set being edited + all saved sets for browse panel
  useEffect(() => {
    const init = async () => {
      const load = async () => {
      const sets = await cardSetsApi.list();
      if (!isLoggedIn()) {
        // Guest created sets
        const guestIds: string[] = JSON.parse(localStorage.getItem('cg_guest_set_ids') || '[]');
        const guestFetches = await Promise.all(
          guestIds.map(id => cardSetsApi.get(id).catch(() => null))
        );
        const guestSets = guestFetches.filter((s): s is CardSet => s !== null);

        // Locally saved sets (premade/community saved via localStorage)
        const localIds = getLocalSavedIds();
        const locallySaved = sets.filter(s => localIds.includes(s.id));

        // Combine all, deduplicate by id
        const combined = [...guestSets, ...locallySaved];
        const deduped = combined.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
        setBrowseSets(deduped);
      } else {
        setBrowseSets(sets.filter(s => s.saved));
      }
    };
    load().catch(() => {});

      if (editId) {
        // Check guest sets first
        const guestSets = JSON.parse(localStorage.getItem('cg_guest_sets') || '[]');
        const guestMatch = guestSets.find((s: any) => s.id === editId);
        if (guestMatch) {
          setEditSet(guestMatch);
          setIsEdit(true);
          setIsCopy(false);
          setSetName(guestMatch.name);
          setDescription(guestMatch.description ?? '');
          setCards(guestMatch.cards.map((c: any) => ({ ...c })));
          setLoadingEdit(false);
          return;
        }

        // Otherwise load from backend
        try {
          const set = await cardSetsApi.get(editId);
          if (set) {
            setEditSet(set);
            const copy = set.author === 'system';
            setIsCopy(copy);
            setIsEdit(!copy);
            setSetName(set.name);
            setDescription(set.description ?? '');
            setCards(set.cards.map(c => ({ ...c })));
          }
        } catch {}
        setLoadingEdit(false);
      }
    };
    init();
  }, [editId]);

  const addCard = () => setCards(prev => [...prev, { id: generateId(), text: '' }]);

  const removeCard = (index: number) => {
    if (cards.length <= 1) return;
    const deleted = cards[index];
    setUndoStack(prev => [{ card: deleted, index }, ...prev].slice(0, MAX_UNDO));
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  const undoDelete = () => {
    if (undoStack.length === 0) return;
    const [last, ...rest] = undoStack;
    const newCards = [...cards];
    newCards.splice(last.index, 0, last.card);
    setCards(newCards);
    setUndoStack(rest);
  };

  const updateCard = (id: string, text: string) =>
    setCards(prev => prev.map(c => c.id === id ? { ...c, text } : c));

  const toggleImportCard = (cardText: string) =>
    setSelectedImportCards(prev =>
      prev.includes(cardText) ? prev.filter(c => c !== cardText) : [...prev, cardText]
    );

  const importSelected = () => {
    setCards(prev => [...prev, ...selectedImportCards.map(text => ({ id: generateId(), text }))]);
    setSelectedImportCards([]);
    setExpandedBrowseId(null);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rawLines = text.split(/[\n\r]+/).map(s => s.trim()).filter(s => s.length > 0);

      // Skip title line if second line is a === separator
      const startIndex = rawLines.length >= 2 && /^=+$/.test(rawLines[1]) ? 2 : 0;
      const lines = rawLines
        .slice(startIndex)
        .flatMap(line => line.split(/[,;]/))
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(s => s.length > 0);

      if (lines.length === 0) {
        setImportFeedback('No cards found in file.');
        return;
      }
      setCards(prev => [...prev, ...lines.map(text => ({ id: generateId(), text }))]);
      setImportFeedback(`Imported ${lines.length} card${lines.length !== 1 ? 's' : ''} from ${file.name}`);
      setTimeout(() => setImportFeedback(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAIGenerate = async (count: 1 | 5 | 10) => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/card-sets/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          count,
          existing_cards: cards.filter(c => c.text.trim()).map(c => c.text),
        }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      const newCards = (data.cards as string[]).map(text => ({
        id: generateId(),
        text,
      }));
      setCards(prev => [...prev, ...newCards]);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const canSave = setName.trim() && cards.some(c => c.text.trim());

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const cleanCards = cards.filter(c => c.text.trim());
      if (isEdit && editId) {
        await cardSetsApi.update(editId, {
          name: setName.trim(), description, category: 'Custom', cards: cleanCards,
        });
      } else {
        const result = await cardSetsApi.create({
          name: setName.trim() || 'My Deck',
          description, category: 'Custom',
          cards: cleanCards, is_public: false,
        });
        // For guests, store the ID in localStorage so they can see it in My Sets
        if (!isLoggedIn()) {
          const guestIds = JSON.parse(localStorage.getItem('cg_guest_set_ids') || '[]');
          localStorage.setItem('cg_guest_set_ids', JSON.stringify([result.id, ...guestIds]));
        }
      }
      navigate('/facilitator/card-library');
    } catch (err) {
      console.error(err);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: '2px solid #e5e7eb', fontSize: '0.9rem', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s',
    background: 'white',
  };

  const pageTitle = isCopy
    ? `Copy of "${editSet?.name ?? ''}"`
    : isEdit ? 'Edit Card Set' : 'New Card Set';
  const pageSubtitle = isCopy
    ? 'Creating a new independent copy'
    : isEdit ? `Editing "${editSet?.name ?? ''}"`
    : 'Build a custom deck for your sessions';

  if (loadingEdit) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif", color: '#9ca3af' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'Georgia', serif" }}>
      <AppBackground />

      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '2px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/facilitator/card-library')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, fontFamily: 'inherit' }}>
            <ArrowLeft size={16} /> Card Library
          </button>
          <p style={{ margin: 0, fontWeight: 800, color: '#1c1917', fontSize: '0.95rem' }}>{pageTitle}</p>
          <SessionBadge />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* ── LEFT ── */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>

          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1px' }}>{pageTitle}</h1>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.88rem' }}>{pageSubtitle}</p>
          </div>

          {/* Deck Info */}
          <div style={{ background: 'rgba(255,255,255,0.9)', border: '2px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <p style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '0.82rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deck Info</p>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: 5 }}>Name *</label>
              <input
                value={setName}
                onChange={e => setSetName(e.target.value)}
                placeholder="My Deck"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: 5 }}>
                Description <span style={{ fontWeight: 400, color: '#9ca3af' }}>(shown in preview)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is this deck about? Who is it for?"
                rows={2}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Cards */}
          <div style={{ background: 'rgba(255,255,255,0.9)', border: '2px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.82rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Cards <span style={{ fontWeight: 600, color: '#9ca3af', textTransform: 'none', letterSpacing: 0 }}>({cards.filter(c => c.text.trim()).length} filled)</span>
              </p>
              <button
                onClick={undoDelete}
                disabled={undoStack.length === 0}
                title={undoStack.length > 0 ? `Undo ${undoStack.length} deletion${undoStack.length !== 1 ? 's' : ''}` : 'Nothing to undo'}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', color: undoStack.length > 0 ? '#374151' : '#d1d5db', fontSize: '0.78rem', fontWeight: 700, cursor: undoStack.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}
              >
                <RotateCcw size={12} color={undoStack.length > 0 ? '#374151' : '#d1d5db'} />
                Undo {undoStack.length > 0 && <span style={{ background: '#f3f4f6', borderRadius: 6, padding: '0px 5px', fontSize: '0.7rem' }}>{undoStack.length}</span>}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1rem' }}>
              {cards.map((card, index) => (
                <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={numCircle}>{index + 1}</span>
                  <input
                    value={card.text}
                    onChange={e => updateCard(card.id, e.target.value)}
                    placeholder="Write a statement..."
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
                    onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    onClick={() => removeCard(index)}
                    disabled={cards.length <= 1}
                    style={{ width: 34, height: 34, borderRadius: 9, border: '1.5px solid #fca5a5', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cards.length <= 1 ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: cards.length <= 1 ? 0.4 : 1, transition: 'transform 0.15s' }}
                    onMouseEnter={e => { if (cards.length > 1) e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCard}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '2px dashed #bbf7d0', background: '#f0fdf4', color: '#15803d', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.borderColor = '#15803d'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
            >
              <Plus size={14} /> Add Card
            </button>
          </div>

          {/* Bottom actions */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input ref={fileInputRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={handleFileImport} />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 18px', borderRadius: 12, border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
            >
              <Upload size={15} /> Import CSV / TXT
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, border: 'none', background: canSave && !saving ? '#15803d' : '#e5e7eb', color: canSave && !saving ? 'white' : '#9ca3af', fontSize: '0.95rem', fontWeight: 800, cursor: canSave && !saving ? 'pointer' : 'not-allowed', boxShadow: canSave ? '0 4px 16px rgba(21,128,61,0.3)' : 'none', transition: 'transform 0.15s, box-shadow 0.15s', opacity: saving ? 0.75 : 1 }}
              onMouseEnter={e => { if (canSave && !saving) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,128,61,0.4)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = canSave ? '0 4px 16px rgba(21,128,61,0.3)' : 'none'; }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : isCopy ? 'Save as New Deck' : 'Save Card Set'}
            </button>
          </div>

          {saveError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#fff5f5', border: '1.5px solid #fca5a5', fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600 }}>
              {saveError}
            </div>
          )}

          {importFeedback && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#f0fdf4', border: '1.5px solid #bbf7d0', fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
              <Check size={14} color="#15803d" /> {importFeedback}
            </div>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>

          {/* AI Generation */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '2px solid #bbf7d0', borderRadius: 20, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={15} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.88rem', color: '#15803d' }}>Generate with AI</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#4b7c5a' }}>Describe your theme, choose how many</p>
              </div>
            </div>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="e.g. Icebreaker questions for a university orientation week..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, marginBottom: '0.75rem', background: 'white' }}
              onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
              onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {([1, 5, 10] as const).map(count => (
                <button
                  key={count}
                  onClick={() => handleAIGenerate(count)}
                  disabled={!aiPrompt.trim() || isGenerating}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '9px 6px', borderRadius: 11, border: 'none', background: aiPrompt.trim() ? '#15803d' : '#e5e7eb', color: aiPrompt.trim() ? 'white' : '#9ca3af', fontSize: '0.78rem', fontWeight: 800, cursor: aiPrompt.trim() && !isGenerating ? 'pointer' : 'not-allowed', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: aiPrompt.trim() ? '0 3px 10px rgba(21,128,61,0.25)' : 'none' }}
                  onMouseEnter={e => { if (aiPrompt.trim()) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 5px 14px rgba(21,128,61,0.35)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = aiPrompt.trim() ? '0 3px 10px rgba(21,128,61,0.25)' : 'none'; }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 900, lineHeight: 1 }}>{count}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>card{count !== 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
            {isGenerating && (
              <p style={{ margin: '0.6rem 0 0', fontSize: '0.75rem', color: '#4b7c5a', textAlign: 'center', fontStyle: 'italic' }}>
                Generating cards...
              </p>
            )}
          </div>

          {/* Import from Saved Sets */}
          <div style={{ background: 'rgba(255,255,255,0.9)', border: '2px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '0.82rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Import from Saved Sets</p>
            <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.5 }}>
              Pick cards from your saved sets to add to this deck.
            </p>

            {browseSets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#9ca3af' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', fontStyle: 'italic' }}>No saved sets yet.</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem' }}>Save some sets in the Card Library first.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {browseSets.map(set => {
                  const isOpen = expandedBrowseId === set.id;
                  const setCardTexts = set.cards.map(c => c.text);
                  const allSelected = setCardTexts.every(t => selectedImportCards.includes(t));
                  return (
                    <div key={set.id} style={{ border: '1.5px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
                      <button
                        onClick={() => setExpandedBrowseId(isOpen ? null : set.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', gap: 8 }}
                      >
                        <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: '#1c1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{set.name}</p>
                          <p style={{ margin: 0, fontSize: '0.68rem', color: '#9ca3af' }}>{set.cards.length} cards</p>
                        </div>
                        {isOpen ? <ChevronUp size={13} color="#6b7280" /> : <ChevronDown size={13} color="#6b7280" />}
                      </button>
                      {isOpen && (
                        <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px' }}>
                          <button
                            onClick={() => {
                              if (allSelected) {
                                setSelectedImportCards(prev => prev.filter(t => !setCardTexts.includes(t)));
                              } else {
                                setSelectedImportCards(prev => [...new Set([...prev, ...setCardTexts])]);
                              }
                            }}
                            style={{ fontSize: '0.7rem', fontWeight: 700, color: allSelected ? '#ef4444' : '#15803d', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 6px 0', display: 'block' }}
                          >
                            {allSelected ? 'Deselect all in set' : 'Select all in set'}
                          </button>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto', marginBottom: selectedImportCards.length > 0 ? 8 : 0 }}>
                            {set.cards.map(card => {
                              const isSelected = selectedImportCards.includes(card.text);
                              return (
                                <button
                                  key={card.id}
                                  onClick={() => toggleImportCard(card.text)}
                                  style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 8px', borderRadius: 8, border: `1.5px solid ${isSelected ? '#4ade80' : '#f0f0f0'}`, background: isSelected ? '#f0fdf4' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s' }}
                                >
                                  <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${isSelected ? '#15803d' : '#d1d5db'}`, background: isSelected ? '#15803d' : 'white', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {isSelected && <Check size={10} color="white" />}
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: '#374151', lineHeight: 1.4 }}>{card.text}</span>
                                </button>
                              );
                            })}
                          </div>
                          {selectedImportCards.length > 0 && (
                            <button
                              onClick={importSelected}
                              style={{ width: '100%', padding: '7px', borderRadius: 9, border: 'none', background: '#15803d', color: 'white', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Import {selectedImportCards.length} card{selectedImportCards.length !== 1 ? 's' : ''}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}