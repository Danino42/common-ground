import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import FacilitatorLogin from './pages/facilitator/FacilitatorLogin'
import FacilitatorDashboard from './pages/facilitator/FacilitatorDashboard'
import FacilitatorGame from './pages/facilitator/game/FacilitatorGame'
import FacilitatorProfile from './pages/facilitator/FacilitatorProfile'
import CreateLobby from './pages/facilitator/CreateLobby'
import CreateCardSet from './pages/facilitator/CreateCardSet'
import CreateCardSetAI from './pages/facilitator/CreateCardSetAI'
import BrowseCardSets from './pages/facilitator/BrowseCardSets'
import PlayerGroupPhase from './pages/player/PlayerGroupPhase'
import PlayerJoin from './pages/player/PlayerJoin'
import PlayerWaiting from './pages/player/PlayerWaiting'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/facilitator/login" element={<FacilitatorLogin />} />
      <Route path="/facilitator/dashboard" element={<FacilitatorDashboard />} />
      <Route path="/facilitator/game/:lobbyCode" element={<FacilitatorGame />} />
      <Route path="/facilitator/profile" element={<FacilitatorProfile />} />
      <Route path="/facilitator/create-lobby" element={<CreateLobby />} />
      <Route path="/facilitator/create-card-set" element={<CreateCardSet />} />
      <Route path="/facilitator/create-card-set-ai" element={<CreateCardSetAI />} />
      <Route path="/facilitator/browse-card-sets" element={<BrowseCardSets />} />
      <Route path="/player/join" element={<PlayerJoin />} />
      <Route path="/player/group-phase" element={<PlayerGroupPhase />} />
      <Route path="/player/waiting/:gameCode/:playerId" element={<PlayerWaiting />} />
    </Routes>
  )
}