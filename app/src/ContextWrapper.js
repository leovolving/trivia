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
  const getInitial = (key) =>
    (adminGames.find(({ _id }) => _id === gameId) || {})[key] || [];
  const [questions, setQuestions] = useState(getInitial("questions"));
  const [categories, setCategories] = useState(getInitial("categories"));
  const [teams, setTeams] = useState(getInitial("teams"));

  const openGame = (id) => {
    return fetch(endpoint(`game/${id}`), { method: "GET" })
      .then(json)
      .then((g) => {
        setGameId(g._id);
        setAdmin(isAdmin);
        setView(VIEWS.admin);
        setTeams(g.teams);
        setCategories(g.categories.map(transformId));
        setQuestions(g.questions.map(transformId));
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (gameId !== "null") openGame(gameId);
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
  };
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default ContextWrapper;
