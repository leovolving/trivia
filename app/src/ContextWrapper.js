import { useState, useContext, createContext, useEffect } from "react";

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
  const [adminGames, setAdminGames] = useStorageState([], "adminGames");
  const [gameId, setGameId] = useStorageState(null, "gameId");
  const [isAdmin, setAdmin] = useState(
    adminGames.map(({ _id }) => _id).includes(gameId)
  );
  const [view, setView] = useState(isAdmin ? VIEWS.admin : VIEWS.game);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [ws, setWs] = useState({});

  const resetSubDocuments = (game = {}) => {
    setTeams((game.teams || []).map(transformId));
    setCategories((game.categories || []).map(transformId));
    setQuestions((game.questions || []).map(transformId));
  };

  const setupGameState = (g) => {
    setGameId(g._id);
    resetSubDocuments(g);
    if (!adminGames.some(({ _id }) => _id === g._id)) {
      setAdminGames([...adminGames, g]);
    }
  };

  // TODO: remove second argument
  const openGame = (key, isCode = false, joiningAsAdmin = true) => {
    ws.send(
      JSON.stringify({
        type: MESSAGE_TYPES.CLIENT_JOIN_GAME,
        key,
        isCode,
        isAdmin: joiningAsAdmin,
      })
    );

    // TODO: set admin via WS response message (or put this in try/catch maybe)
    setAdmin(joiningAsAdmin);
    setView(joiningAsAdmin ? VIEWS.admin : VIEWS.game);
  };

  // TODO: use a hook to set this up?
  const webSocketEventCallbacks = {
    [MESSAGE_TYPES.SERVER_GAME_OBJECT]: setupGameState,
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5150");

    socket.addEventListener("open", () => {
      setWs(socket);
      // fetch game on load if one is already started
      if (gameId !== "null" && gameId !== null) openGame(gameId);
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log(`Calling websocket cb for ${data.type}`);
      webSocketEventCallbacks[data.type](data.payload);
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
    adminGames,
    setAdminGames,
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
    ws,
  };
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default ContextWrapper;
