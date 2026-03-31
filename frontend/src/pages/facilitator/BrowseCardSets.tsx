import { useState } from 'react';
import { Link } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { mockCardSets } from '../../data/mockData';
import { ArrowLeft, Search, Globe, BookOpen } from 'lucide-react';
import greenImg from '../../images/green.png';
import redImg from '../../images/red.png';
import yellowImg from '../../images/yellow.png';
import AppBackground from '../AppBackground';

export default function BrowseCardSets() {
  const [searchQuery, setSearchQuery] = useState('');

  const premadeCardSets = mockCardSets.filter(set => set.author === 'System');
  const communityCardSets = mockCardSets.filter(set => set.author !== 'System');

  const filterCardSets = (sets: typeof mockCardSets) => {
    if (!searchQuery) return sets;
    return sets.filter(set =>
      set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.85)',
    border: '1.5px solid rgba(0,0,0,0.07)',
    borderRadius: 16,
    padding: '1.25rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    display: 'flex' as const,
    flexDirection: 'column' as const,
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
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Link to="/facilitator/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none'
          }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>

        {/* Page title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
            Browse Card Sets
          </h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Explore premade and community-shared card sets</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: 420 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input
            placeholder="Search card sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 38px',
              borderRadius: 12, border: '1.5px solid #e5e7eb',
              fontSize: '0.875rem', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
              transition: 'border-color 0.15s'
            }}
            onFocus={e => e.target.style.borderColor = '#4ade80'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="premade">
          <TabsList style={{
            display: 'inline-flex', gap: 4, background: '#f0fdf4',
            border: '1.5px solid #bbf7d0', borderRadius: 12,
            padding: 4, marginBottom: '1.5rem'
          }}>
            <TabsTrigger value="premade" style={{ borderRadius: 9, padding: '7px 18px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={14} /> Premade Sets
            </TabsTrigger>
            <TabsTrigger value="community" style={{ borderRadius: 9, padding: '7px 18px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={14} /> Community Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="premade">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {filterCardSets(premadeCardSets).map((set, i) => {
                const icons = [yellowImg, greenImg, redImg];
                return (
                  <div
                    key={set.id}
                    style={cardStyle}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={icons[i % icons.length]} alt="" style={{ width: 32, height: 32, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#1c1917' }}>{set.name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>{set.cards.length} cards</p>
                        </div>
                      </div>
                      <span style={{
                        background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                        color: '#15803d', fontSize: '0.7rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0
                      }}>
                        {set.category}
                      </span>
                    </div>

                    {/* Preview cards */}
                    <div style={{ marginBottom: '1rem', flex: 1 }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {set.cards.slice(0, 2).map((card) => (
                          <div key={card.id} style={{
                            fontSize: '0.8rem', color: '#374151',
                            background: '#f9fafb', border: '1px solid #f3f4f6',
                            borderRadius: 8, padding: '7px 10px'
                          }}>
                            {card.text}
                          </div>
                        ))}
                        {set.cards.length > 2 && (
                          <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '2px 0 0' }}>+{set.cards.length - 2} more cards</p>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <button style={{
                      width: '100%', padding: '10px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
                      color: 'white', fontSize: '0.85rem', fontWeight: 700,
                      cursor: 'pointer', transition: 'opacity 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Use
                    </button>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {filterCardSets(communityCardSets).map((set, i) => {
                const icons = [redImg, yellowImg, greenImg];
                return (
                  <div
                    key={set.id}
                    style={cardStyle}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={icons[i % icons.length]} alt="" style={{ width: 32, height: 32, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#1c1917' }}>{set.name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>By {set.author} · {set.cards.length} cards</p>
                        </div>
                      </div>
                      <span style={{
                        background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                        color: '#15803d', fontSize: '0.7rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0
                      }}>
                        {set.category}
                      </span>
                    </div>

                    <div style={{ marginBottom: '1rem', flex: 1 }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {set.cards.slice(0, 2).map((card) => (
                          <div key={card.id} style={{
                            fontSize: '0.8rem', color: '#374151',
                            background: '#f9fafb', border: '1px solid #f3f4f6',
                            borderRadius: 8, padding: '7px 10px'
                          }}>
                            {card.text}
                          </div>
                        ))}
                        {set.cards.length > 2 && (
                          <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '2px 0 0' }}>+{set.cards.length - 2} more cards</p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{
                        flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
                        color: 'white', fontSize: '0.85rem', fontWeight: 700,
                        cursor: 'pointer', transition: 'opacity 0.15s'
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        Use This Set
                      </button>
                      <button style={{
                        padding: '10px 16px', borderRadius: 10,
                        border: '1.5px solid #e5e7eb', background: 'white',
                        fontSize: '0.85rem', fontWeight: 700, color: '#374151', cursor: 'pointer'
                      }}>
                        Copy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}