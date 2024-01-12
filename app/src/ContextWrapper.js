import { useState, useContext, createContext, useEffect, useRef } from "react";

import { VIEWS, MESSAGE_TYPES } from "./constants";
import { useStorageState, transformId } from "./utils";

const Context = createContext();

export function useAppContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(`App context cannot be used outside the App component`);
  }
  return context;
}

const ContextWrapper = ({ children }) => {
  const [recentGames, setRecentGames] = useStorageState([], "recentGames");
  const [gameId, setGameId] = useStorageState(null, "gameId");
  const [isAdmin, setAdmin] = useState(false);
  const [view, setView] = useState(isAdmin ? VIEWS.admin : VIEWS.game);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamId, setLocalTeamId] = useStorageState(null, "teamId");

  const [mostRecentMessage, setMostRecentMessage] = useState({});

  const webSocket = useRef({});

  const resetSubDocuments = (game = {}) => {
    setTeams((game.teams || []).map(transformId));
    setCategories((game.categories || []).map(transformId));
    setQuestions((game.questions || []).map(transformId));
  };

  const setupGameState = (g) => {
    setGameId(g._id);
    resetSubDocuments(g);
    if (!recentGames.some(({ _id }) => _id === g._id)) {
      setRecentGames([
        ...recentGames,
        transformId({ ...g, teamId: g.teamId || teamId }),
      ]);
    }
  };

  const sendWebSocketMessage = (type, data = {}) => {
    webSocket.current.send(JSON.stringify({ type, ...data }));
  };

  const openGame = (key, isCode = false, joiningAsAdmin = true) => {
    const data = {
      key,
      isCode,
      isAdmin: joiningAsAdmin,
    };
    sendWebSocketMessage(MESSAGE_TYPES.CLIENT_JOIN_GAME, data);

    setAdmin(joiningAsAdmin);
    setView(joiningAsAdmin ? VIEWS.admin : VIEWS.game);
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5150");

    socket.addEventListener("open", () => {
      webSocket.current = socket;
      // fetch game on load if one is already started
      if (gameId !== "null" && gameId !== null) {
        console.log({ recentGames, gameId });
        const game = recentGames.find((g) => g.id === gameId);
        setLocalTeamId(game.teamId || null);
        openGame(gameId, false, game.isAdmin);
      }
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log(`Calling websocket cb for ${data.type}`);
      setMostRecentMessage(data);
    });

    return () => {
      if (socket.readyState === 1) {
        console.log("Cleaning up...");
        socket.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  const context = {
    recentGames,
    setRecentGames,
    gameId,
    setGameId,
    isAdmin,
    setAdmin,
    view,
    setView,
    questions,
    setQuestions,
    categories,
    setCategories,
    teams,
    setTeams,
    openGame,
    resetSubDocuments,
    sendWebSocketMessage,
    mostRecentMessage,
    setupGameState,
    teamId,
    setLocalTeamId,
  };
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default ContextWrapper;
