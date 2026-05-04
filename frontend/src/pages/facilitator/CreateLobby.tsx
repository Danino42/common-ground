import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { mockCardSets } from '../../data/mockData';
import { ArrowLeft, Copy, Play, Users, Check, ChevronDown, Monitor, Shuffle, BarChart2, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AppBackground from '../AppBackground';
import { API_URL } from '../../utils/api';

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

  const [toggles, setToggles] = useState({
    anonymousMode: false,
    timerEnabled: false,
    showResults: true,
    allowLateJoin: true,
  });

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

  const copyLobbyCode = () => {
    if (!lobbyCode) return;
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1.5px solid ${config.border}`, fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    background: 'white',
  };

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '0.83rem', color: '#374151', fontWeight: 600 }}>{label}</span>
      <div
        onClick={onChange}
        style={{
          width: 40, height: 22, borderRadius: 11,
          background: value ? config.color : '#e5e7eb',
          position: 'relative', cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: 'white', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );

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
          <Link to="/facilitator/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: config.color, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none'
          }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
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
                    {mockCardSets.map(set => (
                      <option key={set.id} value={set.id}>{set.name} ({set.cards.length} cards)</option>
                    ))}
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
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>Settings</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: '#9ca3af' }}>Placeholder — coming soon</p>
              <Toggle label="Anonymous mode" value={toggles.anonymousMode} onChange={() => toggle('anonymousMode')} />
              <Toggle label="Enable timer" value={toggles.timerEnabled} onChange={() => toggle('timerEnabled')} />
              <Toggle label="Show results live" value={toggles.showResults} onChange={() => toggle('showResults')} />
              {config.hasJoin && <Toggle label="Allow late join" value={toggles.allowLateJoin} onChange={() => toggle('allowLateJoin')} />}
            </div>

            {mode === 'circle' && (
              <div style={{ background: config.bg, border: `1.5px solid ${config.border}`, borderRadius: 16, padding: '1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: config.color, fontWeight: 600, lineHeight: 1.6 }}>
                  In Circle mode, players don't join on their devices. Simply project this screen and go through the cards together as a group.
                </p>
              </div>
            )}
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
                          color: 'white',
                          fontSize: '0.65rem', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
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
                  Players appear here as they join · turns green when done
                </p>
              </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${config.border}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
              <button
                onClick={() => navigate(`/facilitator/game/${lobbyCode || 'OFFLINE'}`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: `linear-gradient(135deg, ${config.color} 0%, ${config.accent} 100%)`,
                  color: 'white', border: 'none', borderRadius: 14,
                  padding: '16px 24px', fontSize: '1rem', fontWeight: 800,
                  cursor: 'pointer',
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
    </div>
  );
}