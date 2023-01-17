import { useState, useEffect } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { Admin, Game, Menu } from "./pages";

import { VIEWS } from "./constants";

import "./index.css";

function useStorageState(initialState, formKey, storageType = localStorage) {
  const existingState = JSON.parse(storageType.getItem(formKey));
  const [state, setState] = useState(existingState || initialState);

  // Persist all state changes to localStorage
  useEffect(() => {
    storageType.setItem(formKey, JSON.stringify(state));
  }, [state, formKey, storageType]);

  return [state, setState];
}

const App = () => {
  const [adminGames, setAdminGames] = useStorageState([], "adminGames");
  const [gameId, setGameId] = useStorageState(null, "gameId");
  const [isAdmin, setAdmin] = useState(
    adminGames.map(({ id }) => id).includes(gameId)
  );
  const [view, setView] = useState(isAdmin ? VIEWS.admin : VIEWS.game);
  const [questions, setQuestions] = useStorageState([], "questions");
  const [categories, setCategories] = useStorageState([], "categories");
  const [teams, setTeams] = useStorageState([], "teams");

  const toggleAdmin = () => {
    setView((prev) => (prev === VIEWS.admin ? VIEWS.game : VIEWS.admin));
  };

  const resetGame = () => {
    const resetWarning =
      "Resetting game will mark all questions as unanswered and remove all teams. Are you sure?";

    if (!window.confirm(resetWarning)) return null;

    setQuestions(questions.map((q) => ({ ...q, isAnswered: false })));
    setTeams([]);
  };

  return (
    <>
      <Card className="app-card" raised>
        <Typography variant="h1">Let's Get Trivial</Typography>
        {isAdmin && (
          <div className="app-card-controls">
            <FormControlLabel
              control={
                <Switch
                  checked={view === VIEWS.admin}
                  onChange={toggleAdmin}
                  color="success"
                />
              }
              label="Admin mode"
            />
            <Button
              type="button"
              onClick={resetGame}
              color="error"
              variant="outlined"
            >
              Reset game
            </Button>
          </div>
        )}
      </Card>
      {gameId ? (
        <>
          {view === VIEWS.admin ? (
            <Admin
              questions={questions}
              setQuestions={setQuestions}
              categories={categories}
              setCategories={setCategories}
              teams={teams}
              setTeams={setTeams}
            />
          ) : (
            <Game
              questions={questions}
              setQuestions={setQuestions}
              categories={categories}
              teams={teams}
              setTeams={setTeams}
              setView={setView}
            />
          )}
        </>
      ) : (
        <Menu
          setAdmin={setAdmin}
          adminGames={adminGames}
          setAdminGames={setAdminGames}
          setGameId={setGameId}
        />
      )}
    </>
  );
};

export default App;
