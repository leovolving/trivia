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
    {
      question: "Where does Sarah work?",
      category: "l-foo",
      points: 200,
      id: "foo5",
    },
    {
      question: "What is Sarah's dad's name?",
      category: "p-foo",
      points: 100,
      id: "foo4",
    },
    {
      question: "What is Sarah's mom's name?",
      category: "p-foo",
      points: 200,
      id: "foo3",
    },
    {
      question: "What is Sarah's hometown?",
      category: "l-foo",
      points: 100,
      id: "foo2",
    },
    {
      question: "What is Sarah's favorite color?",
      category: "f-foo",
      points: 100,
      id: "foo1",
    },
  ]);
  const [categories, setCategories] = useState([
    { label: "general", id: "g-foo" },
    { label: "people", id: "p-foo" },
    { label: "places", id: "l-foo" },
    { label: "faves", id: "f-foo" },
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
