import { useState } from "react";
import { Card, FormControlLabel, Switch, Typography } from "@mui/material";

import { Admin, Game } from "./pages";

import "./index.css";

const App = () => {
  const [isAdmin, setAdmin] = useState(true);
  const [questions, setQuestions] = useState([
    {
      question: "What is Sarah's middle name?",
      category: "g-foo",
      points: 100,
      id: "foo",
    },
  ]);
  const [categories, setCategories] = useState([
    { label: "general", id: "g-foo" },
  ]);
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
        <Game />
      )}
    </>
  );
};

export default App;
