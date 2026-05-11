import { Routes, Route, Navigate } from 'react-router'
import FacilitatorLogin from './pages/facilitator/FacilitatorLogin'
import FacilitatorDashboard from './pages/facilitator/FacilitatorDashboard'
import FacilitatorGame from './pages/facilitator/game/FacilitatorGame'
import FacilitatorProfile from './pages/facilitator/FacilitatorProfile'
import CreateLobby from './pages/facilitator/CreateLobby'
import CardLibrary from './pages/facilitator/CardLibrary';
import CreateCardSet from './pages/facilitator/CreateCardSet'
import PlayerGroupPhase from './pages/player/PlayerGroupPhase'
import PlayerJoin from './pages/player/PlayerJoin'
import PlayerWaiting from './pages/player/PlayerWaiting'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/facilitator/login" replace />} />
      <Route path="/facilitator/login" element={<FacilitatorLogin />} />
      <Route path="/facilitator/dashboard" element={<FacilitatorDashboard />} />
      <Route path="/facilitator/game/:lobbyCode" element={<FacilitatorGame />} />
      <Route path="/facilitator/profile" element={<FacilitatorProfile />} />
      <Route path="/facilitator/create-lobby" element={<CreateLobby />} />
      <Route path="/facilitator/card-library" element={<CardLibrary />} />
      <Route path="/facilitator/create-card-set" element={<CreateCardSet />} />
      <Route path="/player/join" element={<PlayerJoin />} />
      <Route path="/player/group-phase" element={<PlayerGroupPhase />} />
      <Route path="/player/waiting/:gameCode/:playerId" element={<PlayerWaiting />} />
    </Routes>
  )
}