import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { mockCardSets } from '../../data/mockData';
import { Plus, Sparkles, Library, Play, User, LogOut, ChevronRight, Smartphone, BarChart2, Shuffle, Monitor } from 'lucide-react';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import AppBackground from '../AppBackground';
import { SwipeIllustration, ChartIllustration, GroupsIllustration, CircleIllustration } from '../../components/illustrations/GameModeIllustrations';
import { API_URL } from '../../utils/api';

const GAME_MODES = [
  {
    id: 'swipe',
    illustration: <SwipeIllustration />,
    number: '01',
    icon: <Smartphone size={22} />,
    label: 'Swipe Mode',
    sub: 'Players swipe yes/no on their phones, then get grouped by similarity',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    tag: 'Individual → Groups',
    tagColor: '#15803d',
    tagBg: '#dcfce7',
  },
  {
    id: 'topics',
    illustration: <ChartIllustration />,
    number: '02',
    icon: <BarChart2 size={22} />,
    label: 'Topic by Topic',
    sub: 'Cards shown one by one with live stats — ideal for online & large groups (100+)',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
    tag: 'Live Statistics',
    tagColor: '#0369a1',
    tagBg: '#e0f2fe',
  },
  {
    id: 'random',
    illustration: <GroupsIllustration />,
    number: '03',
    icon: <Shuffle size={22} />,
    label: 'Random Groups',
    sub: 'Players join, then the facilitator randomly assigns them into groups with one click',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    tag: 'Quick Setup',
    tagColor: '#7c3aed',
    tagBg: '#ede9fe',
  },
  {
    id: 'circle',
    illustration: <CircleIllustration />,
    number: '04',
    icon: <Monitor size={22} />,
    label: 'Circle (Offline)',
    sub: 'Project the screen and go through cards together — no phones needed',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    tag: 'Fully Offline',
    tagColor: '#b45309',
    tagBg: '#fef3c7',
  },
];

export default function FacilitatorDashboard() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>('swipe');
  const [isLaunching, setIsLaunching] = useState(false);
  const myCardSets = mockCardSets.filter(set => set.author !== 'System').slice(0, 2);

  const handleLaunch = async () => {
    if (!selectedMode) return;
    setIsLaunching(true);
    try {
      const res = await fetch(`${API_URL}/games/create?facilitator_email=guest@example.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_set_id: '1', max_players: 30 }),
      });
      const data = await res.json();
      navigate(`/facilitator/create-lobby?mode=${selectedMode}&code=${data.lobby_code}`);
    } catch {
      navigate(`/facilitator/create-lobby?mode=${selectedMode}`);
    } finally {
      setIsLaunching(false);
    }
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
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src={redImg} alt="" style={{ width: 22, height: 22, transform: 'rotate(-5deg)' }} />
              <img src={yellowImg} alt="" style={{ width: 22, height: 22 }} />
              <img src={greenImg} alt="" style={{ width: 22, height: 22, transform: 'rotate(5deg)' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.5px', color: '#1c1917' }}>Common Ground</span>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ textAlign: 'right', marginRight: 4 }}>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917', margin: 0 }}>Facilitator</p>
              <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0 }}>john.doe@example.com</p>
            </div>
            <Link to="/facilitator/profile">
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 10, border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '0.83rem', fontWeight: 600, color: '#374151', cursor: 'pointer',
              }}>
                <User size={14} /> Profile
              </button>
            </Link>
            <Link to="/">
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 10, border: 'none', background: 'transparent',
                fontSize: '0.83rem', fontWeight: 600, color: '#9ca3af', cursor: 'pointer'
              }}>
                <LogOut size={14} /> Logout
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>

        {/* Page title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
            Your Dashboard
          </h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Choose a game mode and launch your session.</p>
        </div>

        {/* Launch Game Banner */}
        <div style={{
          background: selectedMode
            ? (() => {
                const mode = GAME_MODES.find(m => m.id === selectedMode);
                return `linear-gradient(135deg, ${mode?.color}dd 0%, ${mode?.color}99 100%)`;
              })()
            : 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
          borderRadius: 24,
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: selectedMode ? `0 20px 60px ${GAME_MODES.find(m => m.id === selectedMode)?.color}44` : 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s',
        }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-40px', width: 220, height: 220, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 90, height: 75, flexShrink: 0 }}>
              <img src={redImg} alt="" style={{ position: 'absolute', left: 0, top: 8, width: 52, height: 52, opacity: selectedMode ? 0.9 : 0.3, transform: 'rotate(-15deg)', transition: 'opacity 0.3s' }} />
              <img src={yellowImg} alt="" style={{ position: 'absolute', left: 18, top: 0, width: 46, height: 46, opacity: selectedMode ? 0.9 : 0.3, transition: 'opacity 0.3s' }} />
              <img src={greenImg} alt="" style={{ position: 'absolute', left: 36, top: 12, width: 48, height: 48, opacity: selectedMode ? 0.9 : 0.3, transform: 'rotate(12deg)', transition: 'opacity 0.3s' }} />
            </div>
            <div>
              <p style={{ color: selectedMode ? 'rgba(255,255,255,0.7)' : '#9ca3af', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selectedMode ? `Mode: ${GAME_MODES.find(m => m.id === selectedMode)?.label}` : 'No mode selected yet'}
              </p>
              <h2 style={{ color: selectedMode ? 'white' : '#9ca3af', fontSize: '1.6rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                {selectedMode ? 'Ready to Launch!' : 'Select a game mode below'}
              </h2>
              <p style={{ color: selectedMode ? 'rgba(255,255,255,0.65)' : '#d1d5db', margin: '6px 0 0', fontSize: '0.9rem' }}>
                {selectedMode ? 'Create a lobby, get a QR code, and invite your players' : 'Pick one of the four modes to continue'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            disabled={!selectedMode || isLaunching}
            style={{
              position: 'relative', zIndex: 2, flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 14,
              background: selectedMode ? 'rgba(255,255,255,0.95)' : '#e5e7eb',
              color: selectedMode ? GAME_MODES.find(m => m.id === selectedMode)?.color ?? '#166534' : '#9ca3af',
              border: 'none', borderRadius: 18,
              padding: '18px 32px', fontSize: '1.1rem', fontWeight: 800,
              cursor: selectedMode ? 'pointer' : 'not-allowed',
              boxShadow: selectedMode ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { if (selectedMode) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = selectedMode ? '0 8px 32px rgba(0,0,0,0.2)' : 'none'; }}
          >
            <div style={{
              width: 38, height: 38,
              background: selectedMode ? GAME_MODES.find(m => m.id === selectedMode)?.color ?? '#59b080' : '#d1d5db',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Play size={20} fill="white" color="white" />
            </div>
            {isLaunching ? 'Creating...' : 'Launch Game'}
          </button>
        </div>

        {/* Game Mode Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.5px' }}>
              Select Game Mode
            </h2>
            {selectedMode && (
              <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                ✓ {GAME_MODES.find(m => m.id === selectedMode)?.label} selected
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {GAME_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  style={{
                    background: isSelected ? mode.bg : 'rgba(255,255,255,0.85)',
                    border: isSelected ? `2px solid ${mode.border}` : '1.5px solid rgba(0,0,0,0.07)',
                    borderRadius: 16,
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? `0 8px 24px ${mode.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  {/* Illustration */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ width: 90, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      {mode.illustration}
                    </div>
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: isSelected ? mode.color : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isSelected ? 'white' : '#9ca3af',
                    marginBottom: '0.75rem',
                    transition: 'all 0.15s',
                  }}>
                    {mode.icon}
                  </div>

                  {/* Label */}
                  <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '0.95rem', color: '#1c1917' }}>
                    {mode.label}
                  </p>

                  {/* Description */}
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#78716c', lineHeight: 1.5 }}>
                    {mode.sub}
                  </p>

                  {/* Tag */}
                  <span style={{
                    display: 'inline-block',
                    background: isSelected ? mode.tagBg : '#f3f4f6',
                    color: isSelected ? mode.tagColor : '#9ca3af',
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: 20,
                    transition: 'all 0.15s',
                  }}>
                    {mode.tag}
                  </span>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 20, height: 20, borderRadius: '50%',
                      background: mode.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: 'white', fontWeight: 900,
                    }}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { to: '/facilitator/create-card-set', icon: <Plus size={20} />, label: 'Create Card Set', sub: 'Build a custom set manually', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
            { to: '/facilitator/create-card-set-ai', icon: <Sparkles size={20} />, label: 'Create with AI', sub: 'Generate cards using AI', color: '#65a30d', bg: '#f7fee7', border: '#d9f99d' },
            { to: '/facilitator/browse-card-sets', icon: <Library size={20} />, label: 'Browse Card Sets', sub: 'Explore premade & shared sets', color: '#ca8a04', bg: '#fefce8', border: '#fef08a' },
          ].map((action) => (
            <Link to={action.to} key={action.to}>
              <div
                style={{ background: action.bg, border: `1.5px solid ${action.border}`, borderRadius: 16, padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex', alignItems: 'center', gap: 14 }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  {action.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1c1917' }}>{action.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#78716c' }}>{action.sub}</p>
                </div>
                <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#d1d5db' }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Two-column: My Card Sets + Premade Sets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

          {/* My Card Sets */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.5px' }}>My Card Sets</h2>
              <Link to="/facilitator/create-card-set">
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  <Plus size={13} /> Create New
                </button>
              </Link>
            </div>
            {myCardSets.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: '2.5rem', textAlign: 'center', border: '1.5px dashed #d1d5db' }}>
                <p style={{ color: '#9ca3af', marginBottom: 16, fontStyle: 'italic' }}>No card sets yet</p>
                <Link to="/facilitator/create-card-set">
                  <button style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={15} /> Create Your First Set
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myCardSets.map((set) => (
                  <div key={set.id} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 14, padding: '1rem 1.25rem', border: '1.5px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={yellowImg} alt="" style={{ width: 36, height: 36 }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1c1917', fontSize: '0.95rem' }}>{set.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>{set.cards.length} cards · {set.category}</p>
                      </div>
                    </div>
                    <button style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Edit</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Premade Sets */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.5px' }}>Premade Sets</h2>
              <Link to="/facilitator/browse-card-sets">
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  View All <ChevronRight size={13} />
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockCardSets.filter(set => set.author === 'System').slice(0, 3).map((set, i) => {
                const imgs = [redImg, greenImg, yellowImg];
                return (
                  <div key={set.id} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 14, padding: '1rem 1.25rem', border: '1.5px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={imgs[i % imgs.length]} alt="" style={{ width: 36, height: 36 }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1c1917', fontSize: '0.95rem' }}>{set.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>{set.cards.length} cards · {set.category}</p>
                      </div>
                    </div>
                    <button style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #59b080, #4ade80)', fontSize: '0.8rem', fontWeight: 700, color: 'white', cursor: 'pointer' }}>Use</button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}