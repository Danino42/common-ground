import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft, X } from 'lucide-react';
import AppBackground from '../../AppBackground';
import { API_URL } from '../../../utils/api';
import SwipeResultsView from './SwipeResultsView';
import CircleView from './CircleView';
import GroupingView from './GroupingView';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'swipe';

  const [results, setResults] = useState<Record<string, { yes: number; no: number }>>({});
  const [cards, setCards] = useState<{ id: string; text: string }[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [resultsBlurred, setResultsBlurred] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [gameData, setGameData] = useState<any>(null);
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
        setResults(data.results || {});
        setCards(data.cards || []);
        setPlayers(data.players || []);
        setPlayerAnswers(data.answers || {});
        setGameData(data);
      } catch {}
    };
    fetchResults();
    const interval = setInterval(fetchResults, 1000);
    return () => clearInterval(interval);
  }, [lobbyCode]);

  const color = modeColor[mode] || '#15803d';
  const label = modeLabel[mode] || 'Game';

  return (
    <div style={{ minHeight: '100svh', fontFamily: 'inherit', background: '#fafafa', position: 'relative' }}>
      <AppBackground />

      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, rgba(255,251,235,0.6) 0%, rgba(240,253,244,0.4) 100%)', zIndex: 0, pointerEvents: 'none' }} />

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setShowLeaveConfirm(true)}
              style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontWeight: 600 }}
            >
              <ArrowLeft size={16} /> Dashboard
            </button>
            <div style={{ height: 20, width: 1, background: '#e5e7eb' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}88` }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>
                {label}
              </span>
              {lobbyCode && (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 20 }}>
                  #{lobbyCode}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SessionBadge />

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 20, padding: '4px 12px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>
                {players.length} player{players.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
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
            oneByOne={!!gameData?.one_by_one}
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
        {mode === 'random' && (
          <GroupingView
            players={players}
            answers={playerAnswers}
            onBack={() => {}}
            gameCode={lobbyCode!}
            mode="random"
          />
        )}
      </main>

      {/* Leave confirmation */}
      {showLeaveConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 380, padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff5f5', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <X size={20} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900, fontSize: '1.1rem', color: '#1c1917' }}>End this game?</h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
              Players will lose their connection to this session.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowLeaveConfirm(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                Stay
              </button>
              <button onClick={() => navigate('/facilitator/dashboard')} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                End Game
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}