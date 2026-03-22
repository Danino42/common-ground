import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import FacilitatorLogin from "./pages/FacilitatorLogin";
import FacilitatorDashboard from "./pages/FacilitatorDashboard";
import CreateCardSet from "./pages/CreateCardSet";
import CreateCardSetAI from "./pages/CreateCardSetAI";
import BrowseCardSets from "./pages/BrowseCardSets";
import CreateLobby from "./pages/CreateLobby";
import FacilitatorGame from "./pages/FacilitatorGame";
import FacilitatorProfile from "./pages/FacilitatorProfile";
import PlayerJoin from "./pages/PlayerJoin";
import PlayerWaiting from "./pages/PlayerWaiting";
import PlayerGroupPhase from "./pages/PlayerGroupPhase";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/facilitator/login",
    Component: FacilitatorLogin,
  },
  {
    path: "/facilitator/dashboard",
    Component: FacilitatorDashboard,
  },
  {
    path: "/facilitator/create-card-set",
    Component: CreateCardSet,
  },
  {
    path: "/facilitator/create-card-set-ai",
    Component: CreateCardSetAI,
  },
  {
    path: "/facilitator/browse-card-sets",
    Component: BrowseCardSets,
  },
  {
    path: "/facilitator/create-lobby",
    Component: CreateLobby,
  },
  {
    path: "/facilitator/game/:lobbyCode",
    Component: FacilitatorGame,
  },
  {
    path: "/facilitator/profile",
    Component: FacilitatorProfile,
  },
  {
    path: "/player/join",
    Component: PlayerJoin,
  },
  {
    path: "/player/waiting/:lobbyCode",
    Component: PlayerWaiting,
  },
  {
    path: "/player/group-phase/:lobbyCode",
    Component: PlayerGroupPhase,
  },
]);
