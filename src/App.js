import { useState, useEffect } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { Admin, Game } from "./pages";

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
  const [isAdmin, setAdmin] = useState(true);
  const [questions, setQuestions] = useStorageState([], "questions");
  const [categories, setCategories] = useStorageState([], "categories");

  const toggleAdmin = () => {
    setAdmin(!isAdmin);
  };

  const resetGame = () => {
    const resetWarning =
      "Resetting game will mark all questions as unanswered. Are you sure?";

    if (!window.confirm(resetWarning)) return null;

    setQuestions(questions.map((q) => ({ ...q, isAnswered: false })));
  };

  return (
    <>
      <Card className="app-card" raised>
        <Typography variant="h1">Let's Get Trivial</Typography>
        <div className="app-card-controls">
          <FormControlLabel
            control={
              <Switch
                checked={isAdmin}
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
      </Card>
      {isAdmin ? (
        <Admin
          questions={questions}
          setQuestions={setQuestions}
          categories={categories}
          setCategories={setCategories}
        />
      ) : (
        <Game
          questions={questions}
          setQuestions={setQuestions}
          categories={categories}
        />
      )}
    </>
  );
};

export default App;
