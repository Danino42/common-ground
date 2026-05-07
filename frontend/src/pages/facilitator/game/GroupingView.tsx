import { useState } from 'react';
import { ArrowLeft, Shuffle, Users } from 'lucide-react';
import { card, outlineBtn } from './gameStyles';

const API_URL = import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`;

interface Player {
  player_id: string;
  name: string;
  finished: boolean;
}

interface Props {
  players: Player[];
  answers: Record<string, Record<string, boolean>>;
  onBack: () => void;
  gameCode: string;
}

const GROUP_COLORS = [
  { name: 'Violet', bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6', text: '#6d28d9' },
  { name: 'Sky',    bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6', text: '#1d4ed8' },
  { name: 'Coral',  bg: '#fff1f1', border: '#fca5a5', dot: '#ef4444', text: '#991b1b' },
  { name: 'Mint',   bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e', text: '#15803d' },
  { name: 'Amber',  bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b', text: '#b45309' },
  { name: 'Pink',   bg: '#fdf2f8', border: '#f9a8d4', dot: '#ec4899', text: '#be185d' },
  { name: 'Teal',   bg: '#f0fdfa', border: '#99f6e4', dot: '#14b8a6', text: '#0f766e' },
  { name: 'Orange', bg: '#fff7ed', border: '#fed7aa', dot: '#f97316', text: '#c2410c' },
];

export const GROUP_BG_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#dc2626',
  '#16a34a',
  '#d97706',
  '#db2777',
  '#0d9488',
  '#ea580c',
];

const methodOptions: { value: 'random' | 'similarities' | 'opposites'; label: string; description: string }[] = [
  { value: 'random',       label: 'Random',          description: 'Shuffle players randomly' },
  { value: 'similarities', label: 'By Similarities', description: 'Group players who agree most' },
  { value: 'opposites',    label: 'By Opposites',    description: 'Group players who disagree most' },
];

const purple = '#7c3aed';
const purpleBg = '#faf5ff';
const purpleBorder = '#e9d5ff';

const stepperBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  border: `2px solid ${purpleBorder}`,
  background: 'white', color: purple,
  fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(124,58,237,0.15)',
  transition: 'transform 0.15s, box-shadow 0.15s',
  flexShrink: 0,
};

export default function GroupingView({ players, onBack, gameCode }: Props) {
  const [groupSize, setGroupSize] = useState(3);
  const [method, setMethod] = useState<'random' | 'similarities' | 'opposites'>('random');
  const [groups, setGroups] = useState<Player[][] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const numGroups = Math.ceil(players.length / groupSize);
  const base = Math.floor(players.length / numGroups || 1);
  const remainder = players.length % (numGroups || 1);
  const sizePreview = remainder > 0 ? `${base} & ${base + 1}` : `${base}`;

  const scaleUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.45)';
  };
  const scaleDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)';
  };

  const callGenerateGroups = async (m: string, size: number): Promise<Player[][]> => {
    const res = await fetch(`${API_URL}/games/${gameCode}/generate-groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: m, group_size: size }),
    });
    if (!res.ok) throw new Error('Failed to generate groups');
    const data = await res.json();
    // data.groups is array of player_id arrays — map back to Player objects
    return data.groups.map((group: string[]) =>
      group.map(pid => players.find(p => p.player_id === pid)!).filter(Boolean)
    );
  };

  const saveGroups = async (formed: Player[][]) => {
    await fetch(`${API_URL}/games/${gameCode}/groups`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groups: formed.map(g => g.map(p => p.player_id)) }),
    });
  };

  const handleFormGroups = async () => {
    if (players.length === 0) return;
    setSaving(true);
    setError('');
    try {
      const formed = await callGenerateGroups(method, groupSize);
      setGroups(formed);
      await saveGroups(formed);
    } catch {
      setError('Failed to form groups. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReshuffle = async () => {
    setSaving(true);
    setError('');
    try {
      const formed = await callGenerateGroups(method, groupSize);
      setGroups(formed);
      await saveGroups(formed);
    } catch {
      setError('Failed to re-shuffle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', position: 'relative' }}>
        <button onClick={onBack} style={{ ...outlineBtn, position: 'absolute', left: '1.5rem' }}>
          <ArrowLeft size={16} /> Results
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Form Groups</p>
          <p style={{ margin: '2px 0 0', fontWeight: 900, color: '#1c1917', fontSize: '1.1rem' }}>
            {groups ? `${groups.length} groups formed` : 'Configure grouping'}
          </p>
        </div>
        <span style={{ position: 'absolute', right: '1.5rem', background: purpleBg, border: `1.5px solid ${purpleBorder}`, color: purple, fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
          {players.length} players
        </span>
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '10px 16px', fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {!groups ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

            {/* Group size */}
            <div style={{ ...card }}>
              <p style={{ margin: '0 0 0.9rem', fontSize: '0.75rem', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Group Size</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 100 }}>
                <button
                  style={stepperBtn}
                  onClick={() => setGroupSize(s => Math.max(2, s - 1))}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(124,58,237,0.15)'; }}
                >−</button>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: purple, minWidth: 48, textAlign: 'center' }}>{groupSize}</span>
                <button
                  style={stepperBtn}
                  onClick={() => setGroupSize(s => Math.min(players.length, s + 1))}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(124,58,237,0.15)'; }}
                >+</button>
              </div>
              <p style={{ margin: '0.6rem 0 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textAlign: 'center' }}>
                → {numGroups} group{numGroups !== 1 ? 's' : ''} of {sizePreview}
              </p>
            </div>

            {/* Method */}
            <div style={{ ...card }}>
              <p style={{ margin: '0 0 0.9rem', fontSize: '0.75rem', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Method</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {methodOptions.map(opt => {
                  const isSelected = method === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setMethod(opt.value)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 10,
                        border: isSelected ? `2px solid ${purple}` : '2px solid #e5e7eb',
                        cursor: 'pointer',
                        background: isSelected ? purple : 'white',
                        color: isSelected ? 'white' : '#1c1917',
                        fontSize: '0.85rem', fontWeight: 700,
                        boxShadow: isSelected ? '0 4px 14px rgba(124,58,237,0.35)' : '0 1px 3px rgba(0,0,0,0.07)',
                        transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow = isSelected ? '0 8px 20px rgba(124,58,237,0.45)' : '0 4px 12px rgba(124,58,237,0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = isSelected ? '0 4px 14px rgba(124,58,237,0.35)' : '0 1px 3px rgba(0,0,0,0.07)';
                      }}
                    >
                      <span>{opt.label}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.7 }}>{opt.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Players */}
          <div style={{ ...card }}>
            <p style={{ margin: '0 0 0.9rem', fontSize: '0.75rem', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Players</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {players.map(p => (
                <div key={p.player_id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: p.finished ? '#f0fdf4' : purpleBg,
                  border: `1.5px solid ${p.finished ? '#bbf7d0' : purpleBorder}`,
                  borderRadius: 20, padding: '5px 12px',
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.finished ? '#15803d' : '#c4b5fd', color: 'white', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.finished ? '✓' : p.name[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1c1917' }}>{p.name}</span>
                </div>
              ))}
              {players.length === 0 && <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af', fontStyle: 'italic' }}>No players yet</p>}
            </div>
          </div>

          {/* Form Groups CTA */}
          <button
            onClick={handleFormGroups}
            disabled={players.length === 0 || saving}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '16px 24px', borderRadius: 16, border: 'none',
              background: players.length === 0 ? '#e5e7eb' : purple,
              color: 'white', fontSize: '1rem', fontWeight: 800,
              cursor: players.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: players.length === 0 ? 'none' : '0 4px 14px rgba(124,58,237,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              opacity: saving ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (players.length > 0 && !saving) scaleUp(e); }}
            onMouseLeave={e => { if (players.length > 0 && !saving) scaleDown(e); }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={18} color="white" />
            </div>
            {saving ? 'Forming groups...' : 'Form Groups'}
          </button>
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {groups.map((group, i) => {
              const c = GROUP_COLORS[i % GROUP_COLORS.length];
              return (
                <div key={i} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14, padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.82rem', color: '#1c1917' }}>Group {i + 1}</p>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: c.text, fontWeight: 600 }}>{group.length} players</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {group.map(p => (
                      <div key={p.player_id} style={{ fontSize: '0.78rem', padding: '4px 8px', background: 'white', borderRadius: 7, color: '#374151', fontWeight: 600, border: '1px solid rgba(0,0,0,0.05)' }}>
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setGroups(null)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '13px', borderRadius: 14, border: 'none',
                background: purple, color: 'white',
                fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)'; }}
            >
              ← Change
            </button>
            <button
              onClick={handleReshuffle}
              disabled={saving}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '13px', borderRadius: 14, border: 'none',
                background: purple, color: 'white',
                fontSize: '0.88rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                opacity: saving ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!saving) scaleUp(e); }}
              onMouseLeave={e => { if (!saving) scaleDown(e); }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shuffle size={14} color="white" />
              </div>
              {saving ? 'Saving...' : 'Re-shuffle'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}