import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { mockCardSets } from '../../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Copy, Play, Users, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AppBackground from '../AppBackground';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

export default function CreateLobby() {
  const navigate = useNavigate();
  const [selectedCardSet, setSelectedCardSet] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('30');
  const [lobbyCode, setLobbyCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [playerCount] = useState(0);

  const joinUrl = lobbyCode
  ? `${FRONTEND_URL}/player/join?code=${lobbyCode}&cardSet=${selectedCardSet}`
  : '';

  const handleCreateLobby = async () => {
    if (!selectedCardSet) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/games/create?facilitator_email=guest@example.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_set_id: selectedCardSet,
          max_players: parseInt(maxPlayers),
        }),
      });
      const data = await res.json();
      setLobbyCode(data.lobby_code);
    } catch (err) {
      console.error('Failed to create lobby:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartGame = () => {
    if (lobbyCode) navigate(`/facilitator/game/${lobbyCode}`);
  };

  const copyLobbyCode = () => {
    if (!lobbyCode) return;
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: 'white', fontFamily: "'Georgia', serif" }}>
      <AppBackground />

      <header style={{
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)'
      }}>
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link to="/facilitator/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#15803d', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none'
          }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
            Create Game Lobby
          </h1>
          <p style={{ color: '#78716c', marginTop: 8, fontSize: '1rem' }}>Set up a new Common Ground game session</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Settings card */}
          <div style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800, color: '#1c1917' }}>Game Settings</h2>
            <p style={{ margin: '0 0 1.75rem', fontSize: '0.82rem', color: '#9ca3af' }}>Configure your game session</p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Select Card Set <span style={{ color: '#16a34a' }}>*</span>
              </label>
              <Select value={selectedCardSet} onValueChange={setSelectedCardSet} disabled={!!lobbyCode}>
                <SelectTrigger style={{ borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.875rem' }}>
                  <SelectValue placeholder="Choose a card set" />
                </SelectTrigger>
                <SelectContent>
                  {mockCardSets.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.name} ({set.cards.length} cards)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Maximum Players
              </label>
              <input
                type="number" min="5" max="100"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                disabled={!!lobbyCode}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>Recommended: 15–30 players</p>
            </div>

            {!lobbyCode ? (
              <button
                onClick={handleCreateLobby}
                disabled={!selectedCardSet || isCreating}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: selectedCardSet ? 'linear-gradient(135deg, #278967 0%, #4ade80 100%)' : '#e5e7eb',
                  color: selectedCardSet ? 'white' : '#9ca3af',
                  border: 'none', borderRadius: 14, padding: '18px 28px',
                  fontSize: '1.05rem', fontWeight: 800,
                  cursor: selectedCardSet ? 'pointer' : 'not-allowed',
                  boxShadow: selectedCardSet ? '0 8px 32px rgba(22,101,52,0.25)' : 'none',
                  transition: 'transform 0.15s',
                }}
              >
                <Play size={18} fill="currentColor" />
                {isCreating ? 'Creating...' : 'Create Lobby'}
              </button>
            ) : (
              <button
                onClick={handleStartGame}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
                  color: 'white', border: 'none', borderRadius: 14, padding: '18px 28px',
                  fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(22,101,52,0.25)',
                  transition: 'transform 0.15s',
                }}
              >
                <Play size={18} fill="currentColor" />
                Start Game
              </button>
            )}
          </div>

          {/* Lobby code + QR card */}
          <div style={{
            background: 'linear-gradient(135deg, #278967 0%, #4ade80 100%)',
            borderRadius: 20, padding: '2rem',
            boxShadow: '0 20px 60px rgba(22,101,52,0.3)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800, color: 'white', position: 'relative', zIndex: 1 }}>Game Lobby</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', position: 'relative', zIndex: 1 }}>
              {lobbyCode ? 'Share the code or QR to let players join' : 'Create a lobby to get your code'}
            </p>

            {lobbyCode ? (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Code */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Join Code</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#166534', letterSpacing: '0.15em', margin: '0 0 1rem', fontFamily: 'monospace' }}>
                    {lobbyCode}
                  </p>
                  <button onClick={copyLobbyCode} style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 16px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                    background: 'white', fontSize: '0.85rem', fontWeight: 700, color: '#374151', cursor: 'pointer',
                  }}>
                    {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                {/* QR Code */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan to Join</p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <QRCodeSVG value={joinUrl} size={160} />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '10px 0 0' }}>{joinUrl}</p>
                </div>

                {/* Players waiting */}
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={15} color="rgba(255,255,255,0.7)" />
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ fontWeight: 700, color: 'white' }}>Players waiting:</span> {playerCount}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Play size={36} color="rgba(255,255,255,0.6)" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Your lobby code and QR code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}