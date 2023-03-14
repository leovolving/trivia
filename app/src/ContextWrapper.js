import { useState, useContext, createContext, useEffect } from "react";

import { VIEWS } from "./constants";
import { json, endpoint, useStorageState, transformId } from "./utils";

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

  const openGame = (key, isCode = false, joiningAsAdmin = true) => {
    if (isCode) {
      ws.send(JSON.stringify({ type: "join", gameCode: key }));
    } else {
      const route = "game/" + (isCode ? `code/${key}` : key);
      return fetch(endpoint(route), { method: "GET" })
        .then(json)
        .then((g) => {
          setGameId(g._id);
          setAdmin(joiningAsAdmin);
          setView(joiningAsAdmin ? VIEWS.admin : VIEWS.game);
          resetSubDocuments(g);
          // TODO: only add if not already in adminGames
          if (isCode) setAdminGames([...adminGames, g]);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (gameId !== "null" && gameId !== null) openGame(gameId);

    const socket = new WebSocket("ws://localhost:5150");

    socket.addEventListener("open", () => setWs(socket));

    socket.addEventListener("message", (data) =>
      console.log(JSON.stringify(data))
    );

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
