import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Plus, Bookmark, BookmarkCheck, Search,
  ChevronDown, ChevronUp, Pencil, Trash2, Save, RotateCcw,
  X, Globe, SlidersHorizontal, Download, Copy
} from 'lucide-react';
import AppBackground from '../AppBackground';
import { cardSetsApi } from '../../utils/api';
import type { CardSet } from '../../utils/api';
import { API_URL } from '../../utils/api';
import { isLoggedIn } from '../../utils/auth';
import { getLocalSavedIds, setLocalSavedIds } from '../../utils/savedSets';
import SessionBadge from '../../components/SessionBadge';


interface CardItem { id: string; text: string; }

interface CardSetItem {
  id: string;
  name: string;
  category: string;
  cards: CardItem[];
  author: string;
  author_email?: string;
  author_display?: string;
  is_public: boolean;
  saved: boolean;
  source?: 'premade' | 'community' | 'mine';
  published_at?: string;
  deck_hash?: string;
}

type Tab = 'saved' | 'mine' | 'premade' | 'community';

const numCircle: React.CSSProperties = {
  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
  background: '#f3f4f6', border: '1px solid #e5e7eb',
  fontSize: '0.6rem', fontWeight: 700, color: '#1c1917',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginTop: 1,
};

function apiSetToItem(s: CardSet): CardSetItem {
  const source = s.author === 'system'
    ? 'premade'
    : s.is_public ? 'community' : 'mine';
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    cards: s.cards,
    author: s.author,
    author_email: s.author_email
      ? s.author_email.slice(0, 5)
      : s.author === 'guest' ? 'guest' : undefined,
    author_display: s.author_display,
    is_public: s.is_public,
    saved: s.saved,
    deck_hash: s.deck_hash,
    source,
    published_at: s.created_at,
  };
}

function makeSavedCopy(set: CardSetItem): CardSetItem {
  return { ...set, id: `saved-${set.id}`, saved: true };
}

// ── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({ set, onClose }: { set: CardSetItem; onClose: () => void }) {
  const [hashCopied, setHashCopied] = useState(false);

  const copyHash = () => {
    if (!set.deck_hash) return;
    navigator.clipboard.writeText(set.deck_hash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
              {set.cards.length} cards
            </p>
            <h2 style={{ margin: '0 0 2px', fontWeight: 900, fontSize: '1.2rem', color: '#1c1917', textAlign: 'center' }}>{set.name}</h2>
            <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center' }}>
              {set.author === 'system' ? 'Premade' : set.author === 'guest' ? 'by guest' : `by ${set.author_display ?? set.author_email ?? 'user'}`}
            </p>
            {set.deck_hash && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px' }}>
                <span style={{ fontSize: '0.62rem', color: '#9ca3af', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  🔑 {set.deck_hash.slice(0, 28)}...
                </span>
                <button
                  onClick={copyHash}
                  style={{ flexShrink: 0, padding: '3px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: hashCopied ? '#f0fdf4' : 'white', color: hashCopied ? '#15803d' : '#6b7280', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {hashCopied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12 }}>
            <X size={14} color="#6b7280" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {set.cards.map((card, i) => (
              <div key={card.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', borderRadius: 10, background: '#f9fafb', border: '1px solid #f3f4f6', fontSize: '0.85rem', color: '#374151', lineHeight: 1.4 }}>
                <span style={{ ...numCircle, width: 22, height: 22, fontSize: '0.65rem' }}>{i + 1}</span>
                {card.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Editor Modal ──────────────────────────────────────────────────────────────

function DeckEditor({ set, onClose, onSave }: { set: CardSetItem; onClose: () => void; onSave: (updated: CardSetItem) => void }) {
  const [name, setName] = useState(set.name);
  const [cards, setCards] = useState<CardItem[]>(set.cards.map(c => ({ ...c })));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ card: CardItem; index: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const updateCard = (id: string, text: string) => setCards(prev => prev.map(c => c.id === id ? { ...c, text } : c));
  const deleteCard = (index: number) => { setLastDeleted({ card: cards[index], index }); setCards(prev => prev.filter((_, i) => i !== index)); };
  const undoDelete = () => { if (!lastDeleted) return; const nc = [...cards]; nc.splice(lastDeleted.index, 0, lastDeleted.card); setCards(nc); setLastDeleted(null); };
  const addCard = () => { const c = { id: `new-${Date.now()}`, text: '' }; setCards(prev => [...prev, c]); setEditingId(c.id); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sourceId = set.id.replace('saved-', '');
      const updated = await cardSetsApi.update(sourceId, {
        name, cards: cards.filter(c => c.text.trim()),
      });
      onSave({ ...set, name: updated.name, cards: updated.cards, deck_hash: updated.deck_hash });
      onClose();
    } catch {
      onSave({ ...set, name, cards: cards.filter(c => c.text.trim()) });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '1rem' }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Editing deck</p>
            <input value={name} onChange={e => setName(e.target.value)} style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1c1917', border: 'none', outline: 'none', width: '100%', borderBottom: '2px solid #e5e7eb', paddingBottom: 3, fontFamily: 'inherit', background: 'transparent' }} />
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="#6b7280" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cards.map((card, index) => (
            <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ ...numCircle, width: 22, height: 22, fontSize: '0.65rem' }}>{index + 1}</span>
              {editingId === card.id
                ? <input autoFocus value={card.text} onChange={e => updateCard(card.id, e.target.value)} onBlur={() => setEditingId(null)} onKeyDown={e => e.key === 'Enter' && setEditingId(null)} style={{ flex: 1, padding: '7px 10px', borderRadius: 9, border: '2px solid #4ade80', outline: 'none', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                : <div style={{ flex: 1, padding: '7px 10px', borderRadius: 9, border: '1.5px solid #f0f0f0', background: '#fafafa', fontSize: '0.85rem', color: card.text ? '#374151' : '#d1d5db' }}>{card.text || 'Empty card'}</div>
              }
              <button onClick={() => setEditingId(editingId === card.id ? null : card.id)} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e5e7eb', background: editingId === card.id ? '#f0fdf4' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pencil size={12} color={editingId === card.id ? '#15803d' : '#6b7280'} />
              </button>
              <button onClick={() => deleteCard(index)} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #fca5a5', background: '#fff5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={12} color="#ef4444" />
              </button>
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={addCard} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, border: '1.5px dashed #bbf7d0', background: '#f0fdf4', color: '#15803d', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={13} /> Add Card
          </button>
          {lastDeleted && (
            <button onClick={undoDelete} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              <RotateCcw size={13} /> Undo
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 9, border: 'none', background: '#15803d', color: 'white', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(21,128,61,0.25)', transition: 'transform 0.15s', opacity: saving ? 0.7 : 1 }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Save size={13} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CardLibrary() {
  const navigate = useNavigate();

  const [allSets, setAllSets] = useState<CardSetItem[]>([]);
  const [savedSets, setSavedSets] = useState<CardSetItem[]>([]);
  const [communitySets, setCommunitySets] = useState<CardSetItem[]>([]);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [search, setSearch] = useState('');
  const [communitySearch, setCommunitySearch] = useState('');
  const [communitySort, setCommunitySort] = useState<'date' | 'alpha'>('date');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSet, setEditingSet] = useState<CardSetItem | null>(null);
  const [previewSet, setPreviewSet] = useState<CardSetItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [publishConfirmId, setPublishConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoadingSession(true);
      try {
        const sets = await cardSetsApi.list();
        const items = sets.map(apiSetToItem);

        // For guests, also fetch their sets stored by ID in localStorage
        let guestItems: CardSetItem[] = [];
        if (!isLoggedIn()) {
          const guestIds: string[] = JSON.parse(localStorage.getItem('cg_guest_set_ids') || '[]');
          const guestFetches = await Promise.all(
            guestIds.map(id => cardSetsApi.get(id).catch(() => null))
          );
          guestItems = guestFetches
            .filter((s): s is CardSet => s !== null)
            .map(apiSetToItem);
        }

        const allItems = [...guestItems, ...items];
        setAllSets(allItems);
        setCommunitySets(
          allItems.filter(s => s.is_public && s.author !== 'system')
        );

        if (isLoggedIn()) {
          const saved = sets.filter(s => s.saved).map(s => makeSavedCopy(apiSetToItem(s)));
          setSavedSets(saved);
        } else {
          const localIds = getLocalSavedIds();
          // Include guest-created IDs as saved too
          const guestIds: string[] = JSON.parse(localStorage.getItem('cg_guest_set_ids') || '[]');
          const allSavedIds = new Set([...localIds, ...guestIds]);
          const saved = allItems.filter(s => allSavedIds.has(s.id)).map(makeSavedCopy);
          setSavedSets(saved);
        }
      } catch {
        setAllSets([]);
        setSavedSets([]);
        setCommunitySets([]);
      } finally {
        setLoadingSession(false);
      }
    };
    init();
  }, []);

  const savedSourceIds = new Set(savedSets.map(s => s.id.replace('saved-', '')));

  const toggleSave = async (set: CardSetItem) => {
    const sourceId = set.id.replace('saved-', '');
    if (savedSourceIds.has(sourceId)) {
      setSavedSets(prev => prev.filter(s => s.id !== `saved-${sourceId}`));
      if (isLoggedIn()) {
        try { await cardSetsApi.unsave(sourceId); } catch {}
      } else {
        setLocalSavedIds(getLocalSavedIds().filter(id => id !== sourceId));
      }
    } else {
      setSavedSets(prev => [makeSavedCopy(set), ...prev]);
      if (isLoggedIn()) {
        try { await cardSetsApi.save(sourceId); } catch {}
      } else {
        setLocalSavedIds([...getLocalSavedIds(), sourceId]);
      }
    }
  };

  const exportToTxt = (set: CardSetItem) => {
    const content = [
      set.name,
      '='.repeat(set.name.length),
      '',
      ...set.cards.map(c => c.text),
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${set.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteSet = async (id: string) => {
    const sourceId = id.replace('saved-', '');
    try { await cardSetsApi.delete(sourceId); } catch {}
    // Also remove from guest IDs if present
    const guestIds: string[] = JSON.parse(localStorage.getItem('cg_guest_set_ids') || '[]');
    localStorage.setItem('cg_guest_set_ids', JSON.stringify(guestIds.filter(i => i !== sourceId)));
    setAllSets(prev => prev.filter(s => s.id !== sourceId));
    setSavedSets(prev => prev.filter(s => s.id !== id && s.id !== `saved-${sourceId}`));
    setDeleteConfirmId(null);
  };

  const handlePublishSet = async (id: string) => {
    const sourceId = id.replace('saved-', '');
    const set = allSets.find(s => s.id === sourceId);
    if (!set) { setPublishConfirmId(null); return; }
    try {
      const clone = await cardSetsApi.create({
        name: set.name,
        category: set.category ?? 'Custom',
        description: '',
        cards: set.cards,
        is_public: true,
        auto_save: false,
      });
      const cloneItem = apiSetToItem(clone);
      setAllSets(prev => [...prev, cloneItem]);
      setCommunitySets(prev => [cloneItem, ...prev]);
    } catch {}
    setPublishConfirmId(null);
  };

  const premadeSets = allSets.filter(s => s.author === 'system');
  const mineSets = allSets.filter(s =>
    (s.author === 'user' || s.author === 'guest') && !s.is_public
  );

  const tabSets = (
    activeTab === 'saved'   ? savedSets :
    activeTab === 'mine'    ? mineSets :
    premadeSets
  ).filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const filteredCommunity = communitySets
    .filter(s => s.name.toLowerCase().includes(communitySearch.toLowerCase()))
    .sort((a, b) =>
      communitySort === 'alpha'
        ? a.name.localeCompare(b.name)
        : (b.published_at ?? '').localeCompare(a.published_at ?? '')
    );

  const regularTabs: { key: Tab; label: string; count: number }[] = [
    { key: 'saved',   label: 'Saved',   count: savedSets.length },
    { key: 'mine',    label: 'My Sets', count: mineSets.length },
    { key: 'premade', label: 'Premade', count: premadeSets.length },
  ];

  const cardStyle = {
    background: 'rgba(255,255,255,0.85)',
    border: '2px solid rgba(0,0,0,0.09)',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  };


  if (loadingSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif", color: '#9ca3af' }}>
        Loading your library...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'Georgia', serif" }}>
      <AppBackground />

      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '2px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => navigate('/facilitator/dashboard')} style={{ color: '#9ca3af', display: 'flex', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <p style={{ margin: 0, fontWeight: 800, color: '#1c1917', fontSize: '0.95rem' }}>Card Library</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>Manage and browse card sets</p>
          </div>
          </div>
          <SessionBadge /> 
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Create banner */}
        <div style={{ background: 'linear-gradient(135deg, #15803ddd 0%, #15803d99 100%)', borderRadius: 20, padding: '1.75rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 12px 40px rgba(21,128,61,0.25)', border: '2px solid rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready to build?</p>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Create Your Own Card Set</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>Build manually or generate cards with AI</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, position: 'relative', zIndex: 2 }}>
              <button
                onClick={async () => {
                    try {
                      const res = await fetch(`${API_URL}/games/create?facilitator_email=guest@example.com`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ card_set_id: '1', max_players: 50 }),
                      });
                      const data = await res.json();
                      navigate(`/facilitator/create-lobby?mode=swipe&code=${data.lobby_code}`);
                    } catch {
                      navigate('/facilitator/create-lobby?mode=swipe');
                    }
                  }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 14, border: '2px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', transition: 'transform 0.15s, background 0.15s', backdropFilter: 'blur(4px)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ▶
                </div>
                Quick Launch Swipe
              </button>
               <button
                onClick={() => navigate('/facilitator/create-card-set')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 14, border: 'none', background: 'white', color: '#15803d', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={16} color="white" />
                </div>
                Build a New Deck
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar + search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 12, padding: 4, gap: 2 }}>
              {regularTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setExpandedId(null); }}
                  style={{ padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab.key ? 'white' : 'transparent', color: activeTab === tab.key ? '#15803d' : '#6b7280', fontWeight: activeTab === tab.key ? 800 : 600, fontSize: '0.85rem', boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {tab.label}
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: activeTab === tab.key ? '#f0fdf4' : '#e5e7eb', color: activeTab === tab.key ? '#15803d' : '#9ca3af' }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setActiveTab('community'); setExpandedId(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 12, cursor: 'pointer', border: '2px solid', borderColor: activeTab === 'community' ? '#15803d' : '#bbf7d0', background: activeTab === 'community' ? '#15803d' : '#f0fdf4', color: activeTab === 'community' ? 'white' : '#15803d', fontWeight: 700, fontSize: '0.85rem', boxShadow: activeTab === 'community' ? '0 4px 14px rgba(21,128,61,0.3)' : 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { if (activeTab !== 'community') e.currentTarget.style.borderColor = '#15803d'; }}
              onMouseLeave={e => { if (activeTab !== 'community') e.currentTarget.style.borderColor = '#bbf7d0'; }}
            >
              <Globe size={14} />
              Community
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: activeTab === 'community' ? 'rgba(255,255,255,0.25)' : '#dcfce7', color: activeTab === 'community' ? 'white' : '#15803d' }}>
                {filteredCommunity.length}
              </span>
            </button>
          </div>

          <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              value={activeTab === 'community' ? communitySearch : search}
              onChange={e => activeTab === 'community' ? setCommunitySearch(e.target.value) : setSearch(e.target.value)}
              placeholder="Search sets..."
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = '#4ade80'}
              onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Community sort */}
        {activeTab === 'community' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <SlidersHorizontal size={13} color="#9ca3af" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280' }}>Sort:</span>
            {(['date', 'alpha'] as const).map(s => (
              <button key={s} onClick={() => setCommunitySort(s)} style={{ padding: '4px 10px', borderRadius: 8, border: '2px solid', borderColor: communitySort === s ? '#15803d' : '#e5e7eb', background: communitySort === s ? '#f0fdf4' : 'white', color: communitySort === s ? '#15803d' : '#6b7280', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                {s === 'date' ? 'Latest' : 'A-Z'}
              </button>
            ))}
          </div>
        )}

        {/* Community grid */}
        {activeTab === 'community' && (
          <>
            {filteredCommunity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
                <p style={{ fontWeight: 700, color: '#374151', marginBottom: 6 }}>No community sets yet</p>
                <p style={{ fontSize: '0.85rem' }}>When facilitators publish their decks, they will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {filteredCommunity.map(set => {
                  const isSaved = savedSourceIds.has(set.id);
                  return (
                    <div
                      key={set.id}
                      style={{ ...cardStyle, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                    >
                      <div style={{ padding: '1rem 1rem 0.75rem', flex: 1 }}>
                        <div style={{ marginBottom: '0.6rem' }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1c1917', lineHeight: 1.3 }}>{set.name}</p>
                          <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>
                            by {set.author === 'guest' ? 'guest' : set.author_display ?? set.author_email ?? set.author}
                            · {set.cards.length} cards
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {set.cards.slice(0, 2).map(card => (
                            <div key={card.id} style={{ fontSize: '0.78rem', color: '#374151', padding: '5px 8px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 7, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {card.text}
                            </div>
                          ))}
                          {set.cards.length > 2 && <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>+{set.cards.length - 2} more cards</p>}
                        </div>
                      </div>
                      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 6 }}>
                        <button onClick={() => setPreviewSet(set)} style={{ flex: 1, padding: '7px', borderRadius: 9, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          View All
                        </button>
                        <button
                          onClick={() => toggleSave(set)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, flex: 1, padding: '7px', borderRadius: 9, border: 'none', background: isSaved ? '#fef9c3' : '#dfba6b', color: isSaved ? '#a16207' : 'white', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          {isSaved ? <><BookmarkCheck size={13} color="#a16207" /> Saved</> : <><Bookmark size={13} color="white" /> Save</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* List tabs */}
        {activeTab !== 'community' && (
          <>
            {tabSets.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{activeTab === 'saved' ? '🔖' : activeTab === 'mine' ? '📝' : '📚'}</div>
                <p style={{ fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  {activeTab === 'saved' ? 'No saved sets yet' : activeTab === 'mine' ? 'No sets created yet' : 'No premade sets found'}
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  {activeTab === 'saved' ? 'Browse Premade or Community and save ones you like.' : activeTab === 'mine' ? 'Create your first card set using the banner above.' : 'Try a different search term.'}
                </p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tabSets.map(set => {
                const sourceId = set.id.replace('saved-', '');
                const isSaved = savedSourceIds.has(sourceId);
                const isExpanded = expandedId === set.id;
                const isOwn = set.author === 'user' || set.author === 'guest';
                const isGuestSet = sourceId.startsWith('guest-');
                return (
                  <div key={set.id} style={{ ...cardStyle, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : set.id)}
                        style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #e5e7eb', background: isExpanded ? '#f0fdf4' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                        title="Look into deck"
                      >
                        {isExpanded ? <ChevronUp size={14} color="#15803d" /> : <ChevronDown size={14} color="#6b7280" />}
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#1c1917' }}>{set.name}</p>
                          {activeTab === 'saved' && set.source && (
                            <span style={{ fontSize: '0.67rem', color: '#9ca3af', fontWeight: 500 }}>
                              (from {set.source === 'community' ? 'Community' : set.source === 'premade' ? 'Premade' : 'My Sets'})
                            </span>
                          )}
                          {isSaved && activeTab !== 'saved' && (
                            <span style={{ fontSize: '0.67rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>★ Saved</span>
                          )}
                          {isGuestSet && (
                            <span style={{ fontSize: '0.67rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a' }}>Guest</span>
                          )}
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
                          {set.cards.length} cards · {set.author === 'system' ? 'Premade' : 'You'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {(activeTab === 'saved' || (activeTab === 'mine' && isOwn)) && (
                          <button
                            onClick={() => navigate(`/facilitator/create-card-set?edit=${sourceId}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.78rem', fontWeight: 700, color: '#374151', cursor: 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                        )}
                        {activeTab === 'saved' && (
                          <>
                            {/* Hash copy pill */}
                            {set.deck_hash && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(set.deck_hash!);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#9ca3af'; }}
                                title="Copy deck hash"
                              >
                                {set.deck_hash.slice(0, 6)}
                                <Copy size={10} />
                              </button>
                            )}
                            {/* Export to TXT */}
                            <button
                              onClick={() => exportToTxt(set)}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                              onMouseLeave={e => e.currentTarget.style.background = 'white'}
                              title="Export to TXT"
                            >
                              <Download size={12} /> Export
                            </button>
                          </>
                        )}
                        {activeTab === 'mine' && isOwn && (
                          <>
                            <button
                              onClick={() => setPublishConfirmId(set.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 8, border: '1.5px solid #bbf7d0', background: '#f0fdf4', fontSize: '0.78rem', fontWeight: 700, color: '#15803d', cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                              onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                              title="Publish to Community"
                            >
                              <Globe size={12} /> Publish
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(set.id)}
                              style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #fca5a5', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              title="Delete deck"
                            >
                              <Trash2 size={13} color="#ef4444" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => toggleSave(set)}
                          style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: isSaved ? '#fef9c3' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          title={isSaved ? 'Remove from saved' : 'Save a copy'}
                        >
                          {isSaved ? <BookmarkCheck size={15} color="#a16207" /> : <Bookmark size={15} color="#9ca3af" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '0.75rem 1.25rem 1rem', background: '#f9fafb' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
                          {set.cards.map((card, i) => (
                            <div key={card.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', borderRadius: 9, background: 'white', border: '1px solid #f0f0f0', fontSize: '0.82rem', color: '#374151', lineHeight: 1.4 }}>
                              <span style={numCircle}>{i + 1}</span>
                              {card.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {editingSet && (
        <DeckEditor
          set={editingSet}
          onClose={() => setEditingSet(null)}
          onSave={updated => {
            setAllSets(prev => prev.map(s => s.id === updated.id.replace('saved-', '') ? { ...s, name: updated.name, cards: updated.cards } : s));
            setSavedSets(prev => prev.map(s => s.id === updated.id ? updated : s));
          }}
        />
      )}
      {previewSet && <PreviewModal set={previewSet} onClose={() => setPreviewSet(null)} />}

      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 380, padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff5f5', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={20} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900, fontSize: '1.1rem', color: '#1c1917' }}>Delete this deck?</h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
              Are you sure you want to delete this deck permanently? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteSet(deleteConfirmId)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {publishConfirmId && (() => {
        const set = allSets.find(s => s.id === publishConfirmId.replace('saved-', ''));
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 400, padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Globe size={20} color="#15803d" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900, fontSize: '1.1rem', color: '#1c1917' }}>Publish to Community?</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
                A copy of this deck will be visible to all facilitators in the Community tab. Your original stays in My Sets.
              </p>
              {set && (
                <div style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '0.88rem', color: '#1c1917' }}>{set.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
                    by {set.author === 'guest' ? 'guest' : set.author_display ?? set.author_email ?? 'user'} · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {set.cards.length} cards
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPublishConfirmId(null)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => handlePublishSet(publishConfirmId)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#15803d', color: 'white', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(21,128,61,0.3)' }}>
                  Publish Copy
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}