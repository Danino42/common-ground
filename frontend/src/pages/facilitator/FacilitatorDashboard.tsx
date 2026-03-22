import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { mockCardSets } from '../../data/mockData';
import { Plus, Sparkles, Library, Play, User, LogOut, ChevronRight, Zap } from 'lucide-react';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import AppBackground from '../AppBackground';

export default function FacilitatorDashboard() {
  const myCardSets = mockCardSets.filter(set => set.author !== 'System').slice(0, 2);
  
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
            {/* Logo mark — three shape icons */}
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
                transition: 'all 0.15s'
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
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Ready to run a session? Your tools are below.</p>
        </div>

        {/* ★ THE BUTTON — Start New Game, front and center */}
        <div style={{
          background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
          borderRadius: 24,
          padding: '3rem 2.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 20px 60px rgba(22,101,52,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', right: '-20px', top: '-40px',
            width: 220, height: 220,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', right: '80px', bottom: '-60px',
            width: 160, height: 160,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '50%'
          }} />

          {/* Shape icons floating as decoration */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 110, height: 90, flexShrink: 0 }}>
              <img src={redImg} alt="" style={{ position: 'absolute', left: 0, top: 10, width: 64, height: 64, opacity: 0.9, transform: 'rotate(-15deg)' }} />
              <img src={yellowImg} alt="" style={{ position: 'absolute', left: 22, top: 0, width: 56, height: 56, opacity: 0.9 }} />
              <img src={greenImg} alt="" style={{ position: 'absolute', left: 44, top: 14, width: 60, height: 60, opacity: 0.9, transform: 'rotate(12deg)' }} />
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Ready to play?
              </p>
              <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                Start a New Game
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', margin: '8px 0 0', fontSize: '0.95rem' }}>
                Create a lobby and invite your players
              </p>
            </div>
          </div>

          <Link to="/facilitator/create-lobby" style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'white',
              color: '#166534',
              border: 'none',
              borderRadius: 18,
              padding: '20px 36px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '-0.3px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
            >
              <div style={{
                width: 42, height: 42,
                background: 'linear-gradient(135deg, #59b080, #4ade80)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Play size={22} fill="white" color="white" />
              </div>
              Launch Game
            </button>
          </Link>
        </div>

        {/* Quick Actions — 3 smaller tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            {
              to: '/facilitator/create-card-set',
              icon: <Plus size={20} />,
              label: 'Create Card Set',
              sub: 'Build a custom set manually',
              color: '#15803d',
              bg: '#f0fdf4',
              border: '#bbf7d0'
            },
            {
              to: '/facilitator/create-card-set-ai',
              icon: <Sparkles size={20} />,
              label: 'Create with AI',
              sub: 'Generate cards using AI',
              color: '#65a30d',
              bg: '#f7fee7',
              border: '#d9f99d'
            },
            {
              to: '/facilitator/browse-card-sets',
              icon: <Library size={20} />,
              label: 'Browse Card Sets',
              sub: 'Explore premade & shared sets',
              color: '#ca8a04',
              bg: '#fefce8',
              border: '#fef08a'
            }
          ].map((action) => (
            <Link to={action.to} key={action.to}>
              <div style={{
                background: action.bg,
                border: `1.5px solid ${action.border}`,
                borderRadius: 16,
                padding: '1.25rem 1.25rem',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'flex', alignItems: 'center', gap: 14
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: action.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0
                }}>
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
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                  borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white',
                  fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer'
                }}>
                  <Plus size={13} /> Create New
                </button>
              </Link>
            </div>

            {myCardSets.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: '2.5rem',
                textAlign: 'center', border: '1.5px dashed #d1d5db'
              }}>
                <p style={{ color: '#9ca3af', marginBottom: 16, fontStyle: 'italic' }}>No card sets yet</p>
                <Link to="/facilitator/create-card-set">
                  <button style={{
                    background: '#16a34a', color: 'white', border: 'none',
                    borderRadius: 10, padding: '10px 20px', fontWeight: 700,
                    fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6
                  }}>
                    <Plus size={15} /> Create Your First Set
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myCardSets.map((set) => (
                  <div key={set.id} style={{
                    background: 'rgba(255,255,255,0.8)', borderRadius: 14,
                    padding: '1rem 1.25rem',
                    border: '1.5px solid rgba(0,0,0,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={yellowImg} alt="" style={{ width: 36, height: 36 }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1c1917', fontSize: '0.95rem' }}>{set.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>{set.cards.length} cards · {set.category}</p>
                      </div>
                    </div>
                    <button style={{
                      padding: '6px 14px', borderRadius: 8,
                      border: '1.5px solid #e5e7eb', background: 'white',
                      fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer'
                    }}>Edit</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Premade Card Sets */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.5px' }}>Premade Sets</h2>
              <Link to="/facilitator/browse-card-sets">
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                  borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white',
                  fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer'
                }}>
                  View All <ChevronRight size={13} />
                </button>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockCardSets.filter(set => set.author === 'System').slice(0, 3).map((set, i) => {
                const imgs = [redImg, greenImg, yellowImg];
                return (
                  <div key={set.id} style={{
                    background: 'rgba(255,255,255,0.8)', borderRadius: 14,
                    padding: '1rem 1.25rem',
                    border: '1.5px solid rgba(0,0,0,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={imgs[i % imgs.length]} alt="" style={{ width: 36, height: 36 }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1c1917', fontSize: '0.95rem' }}>{set.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>{set.cards.length} cards · {set.category}</p>
                      </div>
                    </div>
                    <button style={{
                      padding: '6px 14px', borderRadius: 8,
                      border: 'none',
                      background: 'linear-gradient(135deg, #59b080, #4ade80)',
                      fontSize: '0.8rem', fontWeight: 700, color: 'white', cursor: 'pointer'
                    }}>Use</button>
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