import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { cardSetsApi } from '../../utils/api';
import type { CardSet } from '../../utils/api';
import { ArrowLeft, Copy, Play, Users, Check, ChevronDown, Monitor, Shuffle, BarChart2, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AppBackground from '../AppBackground';
import { API_URL } from '../../utils/api';
import { getLocalSavedIds } from '../../utils/savedSets';
import { isLoggedIn } from '../../utils/auth';
import SessionBadge from '../../components/SessionBadge';


const MODE_CONFIG = {
  swipe: {
    label: 'Swipe Mode',
    sub: 'Players swipe yes/no, then get grouped by similarity',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    accent: '#4ade80',
    icon: <Smartphone size={18} />,
    hasCardSet: true,
    hasJoin: true,
  },
  topics: {
    label: 'Topic by Topic',
    sub: 'Cards shown one by one with live stats',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
    accent: '#38bdf8',
    icon: <BarChart2 size={18} />,
    hasCardSet: true,
    hasJoin: true,
  },
  random: {
    label: 'Random Groups',
    sub: 'Players join, then get randomly assigned into groups',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    accent: '#a78bfa',
    icon: <Shuffle size={18} />,
    hasCardSet: false,
    hasJoin: true,
  },
  circle: {
    label: 'Circle (Offline)',
    sub: 'Project the screen and go through cards together',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    accent: '#fbbf24',
    icon: <Monitor size={18} />,
    hasCardSet: true,
    hasJoin: false,
  },
};

interface Player {
  player_id: string;
  name: string;
  finished: boolean;
}

export default function CreateLobby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code');
  const mode = (searchParams.get('mode') || 'swipe') as keyof typeof MODE_CONFIG;
  const config = MODE_CONFIG[mode] || MODE_CONFIG.swipe;

  const [selectedCardSet, setSelectedCardSet] = useState('');
  const [groupSize, setGroupSize] = useState('5');
  const [lobbyCode] = useState<string | null>(codeFromUrl);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [randomizeDeck, setRandomizeDeck] = useState(false);

  const joinUrl = lobbyCode
    ? `${window.location.origin}/player/join?code=${lobbyCode}&mode=${mode}`
    : '';

  // Poll every 3 seconds for new players
  useEffect(() => {
    if (!lobbyCode) return;
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${lobbyCode}`);
        const data = await res.json();
        setPlayers(data.players || []);
      } catch {}
    };
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 3000);
    return () => clearInterval(interval);
  }, [lobbyCode]);

  const handleStartGame = async () => {
    if (config.hasCardSet && !selectedCardSet) return;
    try {
      await fetch(
        `${API_URL}/games/${lobbyCode}/start?card_set_id=${selectedCardSet}&randomize=${randomizeDeck ? 'true' : 'false'}`,
        { method: 'PATCH' }
      );
    } catch {}
    navigate(`/facilitator/game/${lobbyCode}?mode=${mode}`);
  };

  const copyLobbyCode = () => {
    if (!lobbyCode) return;
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build dropdown options: saved first, then premade, deduped
  const [allSets, setAllSets] = useState<CardSet[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const sets = await cardSetsApi.list();
        // For guests, also fetch their sets by ID from localStorage
        if (!isLoggedIn()) {
          const guestIds: string[] = JSON.parse(localStorage.getItem('cg_guest_set_ids') || '[]');
          const guestFetches = await Promise.all(
            guestIds.map(id => cardSetsApi.get(id).catch(() => null))
          );
          const guestSets = guestFetches.filter((s): s is CardSet => s !== null);
          setAllSets([...guestSets, ...sets]);
        } else {
          setAllSets(sets);
        }
      } catch {}
    };
    load();
  }, []);

  const localIds = new Set(getLocalSavedIds());
  const guestSets: CardSet[] = !isLoggedIn()
    ? JSON.parse(localStorage.getItem('cg_guest_sets') || '[]')
    : [];

  const allAvailable = [...guestSets, ...allSets];

  const savedSets = allAvailable.filter(s =>
    isLoggedIn() ? s.saved : localIds.has(s.id)
  );
  const premadeSets = allSets.filter(s =>
    s.author === 'system' && !(isLoggedIn() ? s.saved : localIds.has(s.id))
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1.5px solid ${config.border}`, fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    background: 'white',
  };

  const finishedCount = players.filter(p => p.finished).length;

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>
      <AppBackground />

      <header style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${config.border}`,
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: `0 2px 16px ${config.color}11`,
      }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowLeaveConfirm(true)}
            style={{ color: config.color, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Logged in indicator */}
            <SessionBadge />

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: config.bg, border: `1.5px solid ${config.border}`,
              borderRadius: 20, padding: '5px 14px',
              color: config.color, fontSize: '0.82rem', fontWeight: 700,
            }}>
              {config.icon}
              {config.label}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
            {config.label}
          </h1>
          <p style={{ color: '#78716c', marginTop: 6, fontSize: '1rem' }}>{config.sub}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: config.hasJoin ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1.5rem' }}>

          {/* LEFT: QR + Code */}
          {config.hasJoin && (
            <div style={{
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.accent} 100%)`,
              borderRadius: 20, padding: '2rem',
              boxShadow: `0 20px 60px ${config.color}44`,
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: 'white' }}>Join this session</h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>Share the code or scan to join</p>
              </div>

              {!lobbyCode ? (
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Play size={28} color="rgba(255,255,255,0.6)" />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>No lobby code found</p>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ background: 'white', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan to Join</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <QRCodeSVG value={joinUrl} size={169} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code</p>
                    <p style={{ fontSize: '2.2rem', fontWeight: 900, color: config.color, letterSpacing: '0.15em', margin: '0 0 0.75rem', fontFamily: 'monospace' }}>
                      {lobbyCode}
                    </p>
                    <button onClick={copyLobbyCode} style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px', borderRadius: 8, border: `1.5px solid ${config.border}`,
                      background: 'white', fontSize: '0.82rem', fontWeight: 700, color: config.color, cursor: 'pointer',
                    }}>
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '0.6rem 0.85rem' }}>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.75)', wordBreak: 'break-all', fontFamily: 'monospace' }}>{joinUrl}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MIDDLE: Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {config.hasCardSet && (
              <div style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${config.border}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>Card Set</h3>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedCardSet}
                    onChange={e => setSelectedCardSet(e.target.value)}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
                  >
                    <option value="">Choose a card set...</option>
                    {savedSets.length > 0 && (
                      <optgroup label="── Saved Sets">
                        {savedSets.map(set => (
                          <option key={set.id} value={set.id}>{set.name} ({set.cards.length} cards)</option>
                        ))}
                      </optgroup>
                    )}
                    {premadeSets.length > 0 && (
                      <optgroup label="── Premade Sets">
                        {premadeSets.map(set => (
                          <option key={set.id} value={set.id}>{set.name} ({set.cards.length} cards)</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                </div>
              </div>
            )}

            {mode === 'random' && (
              <div style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${config.border}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>Group Size</h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: '#9ca3af' }}>How many people per group?</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => setGroupSize(s => String(Math.max(2, parseInt(s) - 1)))} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${config.border}`, background: config.bg, color: config.color, fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: config.color }}>{groupSize}</span>
                    <span style={{ fontSize: '0.82rem', color: '#9ca3af', marginLeft: 6 }}>people</span>
                  </div>
                  <button onClick={() => setGroupSize(s => String(Math.min(20, parseInt(s) + 1)))} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${config.border}`, background: config.bg, color: config.color, fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${config.border}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>Settings</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.83rem', color: '#374151', fontWeight: 600 }}>Randomize card order</span>
                <div
                  onClick={() => setRandomizeDeck(v => !v)}
                  style={{ width: 40, height: 22, borderRadius: 11, background: randomizeDeck ? config.color : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 3, left: randomizeDeck ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Players + Launch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {config.hasJoin && (
              <div style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${config.border}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>With us</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ background: config.bg, border: `1.5px solid ${config.border}`, color: config.color, fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                      {players.length} joined
                    </span>
                    {finishedCount > 0 && (
                      <span style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                        {finishedCount} done ✓
                      </span>
                    )}
                  </div>
                </div>

                {players.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <Users size={28} color="#d1d5db" style={{ marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af', fontStyle: 'italic' }}>Waiting for players...</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {players.map((player) => (
                      <div key={player.player_id} style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        background: player.finished ? '#f0fdf4' : config.bg,
                        border: `1.5px solid ${player.finished ? '#bbf7d0' : config.border}`,
                        borderRadius: 20, padding: '5px 12px',
                        transition: 'all 0.3s',
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: player.finished ? '#15803d' : config.color,
                          color: 'white', fontSize: '0.65rem', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {player.finished ? '✓' : player.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
                          {player.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>
                  Players appear here as they join
                </p>
              </div>
            )}

            {mode === 'circle' && (
            <div style={{ background: config.bg, border: `1.5px solid ${config.border}`, borderRadius: 16, padding: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: config.color, fontWeight: 600, lineHeight: 1.6 }}>
                In Circle mode, players don't join on their devices. Simply project this screen and go through the cards together as a group.
              </p>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${config.border}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <button
              onClick={handleStartGame}
                disabled={config.hasCardSet && !selectedCardSet}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: config.hasCardSet && !selectedCardSet
                    ? '#cdced1'
                    : `linear-gradient(135deg, ${config.color} 0%, ${config.accent} 100%)`,
                  cursor: config.hasCardSet && !selectedCardSet ? 'not-allowed' : 'pointer',
                  color: 'white', border: 'none', borderRadius: 14,
                  padding: '16px 24px', fontSize: '1rem', fontWeight: 800,

                  boxShadow: `0 8px 32px ${config.color}44`,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Play size={18} fill="currentColor" />
                Start Game
              </button>
              {mode === 'circle' && (
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
                  No lobby needed — just project and go
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {showLeaveConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '2rem', maxWidth: 380, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <ArrowLeft size={20} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900, fontSize: '1.1rem', color: '#1c1917' }}>Leave this game?</h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
              Are you sure you want to go back to the dashboard? This will abort your game.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowLeaveConfirm(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                Stay
              </button>
              <button onClick={() => navigate('/facilitator/dashboard')} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}