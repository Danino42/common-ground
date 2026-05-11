import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { clearSession, isLoggedIn } from '../../utils/auth';
import { Play, User, LogOut, Smartphone, BarChart2, Shuffle, Monitor, Library } from 'lucide-react';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import AppBackground from '../AppBackground';
import { SwipeIllustration, ChartIllustration, GroupsIllustration, CircleIllustration } from '../../components/illustrations/GameModeIllustrations';
import { API_URL } from '../../utils/api';
import SessionBadge from '../../components/SessionBadge';

const GAME_MODES = [
  {
    id: 'swipe',
    illustration: <SwipeIllustration />,
    icon: <Smartphone size={22} />,
    label: 'Swipe Mode',
    sub: 'Players swipe yes/no on their phones, then can be grouped by similarity',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    tag: 'Individual → Groups',
    tagColor: '#15803d',
    tagBg: '#dcfce7',
    unavailable: false,
  },
  {
    id: 'topics',
    illustration: <ChartIllustration />,
    icon: <BarChart2 size={22} />,
    label: 'Guided Mode',
    sub: 'Cards shown one by one with live stats — ideal for online & large groups',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
    tag: 'Live Statistics',
    tagColor: '#0369a1',
    tagBg: '#e0f2fe',
    unavailable: true,
  },
  {
    id: 'random',
    illustration: <GroupsIllustration />,
    icon: <Shuffle size={22} />,
    label: 'Random Groups',
    sub: 'Players join, then the facilitator randomly assigns them into groups with one click',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    tag: 'Quick Setup',
    tagColor: '#7c3aed',
    tagBg: '#ede9fe',
    unavailable: true,
  },
  {
    id: 'circle',
    illustration: <CircleIllustration />,
    icon: <Monitor size={22} />,
    label: 'Circle (Offline)',
    sub: 'Project the screen and go through cards together — no phones needed',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    tag: 'Fully Offline',
    tagColor: '#b45309',
    tagBg: '#fef3c7',
    unavailable: false,
  },
];

export default function FacilitatorDashboard() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>('swipe');
  const [isLaunching, setIsLaunching] = useState(false);

  const isGuest = !isLoggedIn();

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
            <SessionBadge />
            <Link to="/facilitator/profile">
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.83rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                <User size={14} /> Profile
              </button>
            </Link>
            <button
              onClick={() => { clearSession(); navigate('/'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', background: 'transparent', fontSize: '0.83rem', fontWeight: 600, color: '#9ca3af', cursor: 'pointer' }}
            >
              <LogOut size={14} /> {isGuest ? 'Exit' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>

        {/* Launch Game Banner */}
        <div style={{
          background: selectedMode
            ? `linear-gradient(135deg, ${GAME_MODES.find(m => m.id === selectedMode)?.color}dd 0%, ${GAME_MODES.find(m => m.id === selectedMode)?.color}99 100%)`
            : 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
          borderRadius: 24,
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'relative', zIndex: 2 }}>
            <button
              onClick={() => navigate('/facilitator/card-library')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.18)', color: 'white',
                border: '2px solid rgba(255,255,255,0.35)', borderRadius: 18,
                padding: '14px 22px', fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            >
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.25)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Library size={17} color="white" />
              </div>
              Card Library
            </button>

            <button
              onClick={handleLaunch}
              disabled={!selectedMode || isLaunching}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: selectedMode ? 'rgba(255,255,255,0.95)' : '#e5e7eb',
                color: selectedMode ? GAME_MODES.find(m => m.id === selectedMode)?.color ?? '#166534' : '#9ca3af',
                border: 'none', borderRadius: 18,
                padding: '18px 32px', fontSize: '1.1rem', fontWeight: 800,
                cursor: selectedMode ? 'pointer' : 'not-allowed',
                boxShadow: selectedMode ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { if (selectedMode) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = selectedMode ? '0 8px 32px rgba(0,0,0,0.2)' : 'none'; }}
            >
              <div style={{ width: 38, height: 38, background: selectedMode ? GAME_MODES.find(m => m.id === selectedMode)?.color ?? '#59b080' : '#d1d5db', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Play size={20} fill="white" color="white" />
              </div>
              {isLaunching ? 'Creating...' : 'Launch Game'}
            </button>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div>
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
                  onClick={() => !mode.unavailable && setSelectedMode(mode.id)}
                  style={{
                    background: mode.unavailable ? '#fafafa' : isSelected ? mode.bg : 'rgba(255,255,255,0.85)',
                    border: isSelected ? `2px solid ${mode.border}` : '1.5px solid rgba(0,0,0,0.07)',
                    borderRadius: 16, padding: '1.25rem',
                    cursor: mode.unavailable ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? `0 8px 24px ${mode.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                    position: 'relative', overflow: 'hidden',
                    opacity: mode.unavailable ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!isSelected && !mode.unavailable) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; } }}
                  onMouseLeave={e => { if (!isSelected && !mode.unavailable) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; } }}
                >
                  {/* Not yet available banner */}
                  {mode.unavailable && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      background: '#f3f4f6', color: '#6b7280',
                      fontSize: '0.6rem', fontWeight: 800,
                      padding: '3px 8px', borderRadius: 20,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      border: '1px solid #e5e7eb',
                    }}>
                      Not yet available
                    </div>
                  )}

                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ width: 90, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      {mode.illustration}
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: isSelected ? mode.color : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? 'white' : '#9ca3af', marginBottom: '0.75rem', transition: 'all 0.15s' }}>
                    {mode.icon}
                  </div>
                  <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '0.95rem', color: '#1c1917' }}>{mode.label}</p>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#78716c', lineHeight: 1.5 }}>{mode.sub}</p>
                  <span style={{ display: 'inline-block', background: isSelected ? mode.tagBg : '#f3f4f6', color: isSelected ? mode.tagColor : '#9ca3af', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20, transition: 'all 0.15s' }}>
                    {mode.tag}
                  </span>
                  {isSelected && !mode.unavailable && (
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: mode.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'white', fontWeight: 900 }}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}