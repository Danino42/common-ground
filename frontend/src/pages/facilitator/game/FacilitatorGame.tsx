import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import AppBackground from '../../AppBackground';
import { API_URL } from '../../../utils/api';
import SwipeResultsView from './SwipeResultsView';
import CircleView from './CircleView';
import GroupsView from './GroupsView';
import SessionBadge from '../../../components/SessionBadge';

const modeColor: Record<string, string> = {
  swipe: '#15803d', circle: '#b45309', random: '#7c3aed', topics: '#0369a1',
};
const modeLabel: Record<string, string> = {
  swipe: 'Swipe Mode', circle: 'Circle (Offline)', random: 'Random Groups', topics: 'Topic by Topic',
};

interface Player {
  player_id: string;
  name: string;
  finished: boolean;
}

export default function FacilitatorGame() {
  const { lobbyCode } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'swipe';

  const [results, setResults] = useState<Record<string, { yes: number; no: number }>>({});
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [resultsBlurred, setResultsBlurred] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    document.body.style.minHeight = '100svh';
    const root = document.getElementById('root');
    if (root) {
      root.style.borderInline = 'none';
      root.style.maxWidth = '100%';
      root.style.width = '100%';
      root.style.margin = '0';
    }
    return () => {
      document.body.style.minHeight = '';
      if (root) {
        root.style.borderInline = '';
        root.style.maxWidth = '';
        root.style.width = '';
        root.style.margin = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!lobbyCode) return;
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${lobbyCode}/results`);
        const data = await res.json();
        
        if (data.cards && data.cards.length > 0) setCards(data.cards);
        setResults(data.results || {});
        setPlayers(data.players || []);
        setPlayerAnswers(data.answers || {});
      } catch {}
    };
    fetchResults();
    const interval = setInterval(fetchResults, 1000);
    return () => clearInterval(interval);
  }, [lobbyCode]);

  const [cards, setCards] = useState<{ id: string; text: string }[]>([]);


  return (
    <div style={{
      minHeight: '100svh',
      fontFamily: "'Georgia', serif",
      background: '#fafafa',
      position: 'relative',
    }}>
      <AppBackground />

      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(160deg, rgba(255,251,235,0.6) 0%, rgba(240,253,244,0.4) 100%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
      }}>
        <div className="max-w-5xl mx-auto px-6 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setShowLeaveConfirm(true)}
              style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontWeight: 600 }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p style={{ margin: 0, fontWeight: 800, color: '#1c1917', fontSize: '0.95rem' }}>
                <span style={{ color: modeColor[mode] || '#15803d' }}>●</span> {modeLabel[mode] || 'Game'}
              </p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                {lobbyCode}
              </p>
            </div>
          </div>
          <SessionBadge />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8" style={{ position: 'relative', zIndex: 1 }}>
        {(mode === 'swipe' || mode === 'topics') && (
          <SwipeResultsView
            results={results}
            cards={cards}
            currentResultIndex={currentResultIndex}
            setCurrentResultIndex={setCurrentResultIndex}
            resultsBlurred={resultsBlurred}
            setResultsBlurred={setResultsBlurred}
            players={players}
            playerAnswers={playerAnswers}
            gameCode={lobbyCode!}
          />
        )}
        {mode === 'circle' && (
          <CircleView
            cards={cards}
            results={results}
            resultsBlurred={resultsBlurred}
            setResultsBlurred={setResultsBlurred}
          />
        )}
        {mode === 'random' && <GroupsView />}
      </main>
      {showLeaveConfirm && (
                <div style={{
                  position: 'fixed', inset: 0, zIndex: 200,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    background: 'white', borderRadius: 20, padding: '2rem',
                    maxWidth: 380, width: '90%',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <ArrowLeft size={20} color="#ef4444" />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900, fontSize: '1.1rem', color: '#1c1917' }}>
                      Leave this game?
                    </h3>
                    <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
                      Are you sure you want to go back to the dashboard? This will abort your game.
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setShowLeaveConfirm(false)}
                        style={{
                          flex: 1, padding: '11px', borderRadius: 12,
                          border: '1.5px solid #e5e7eb', background: 'white',
                          color: '#374151', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Stay
                      </button>
                      <button
                        onClick={() => { window.location.href = '/facilitator/dashboard'; }}
                        style={{
                          flex: 1, padding: '11px', borderRadius: 12,
                          border: 'none', background: '#ef4444',
                          color: 'white', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                        }}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              )}
    </div>
  );
}