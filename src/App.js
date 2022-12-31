import { useState, useEffect } from "react";
import { Card, FormControlLabel, Switch, Typography } from "@mui/material";

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
  return (
    <>
      <Card className="app-card">
        <Typography variant="h1">Let's Get Trivial</Typography>
        <FormControlLabel
          control={
            <Switch checked={isAdmin} onChange={toggleAdmin} color="success" />
          }
          label="Admin mode"
        />
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
