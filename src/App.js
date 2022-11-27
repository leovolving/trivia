import { useState } from "react";
import { Card, FormControlLabel, Switch, Typography } from "@mui/material";

import { Admin, Game } from "./pages";

import "./index.css";

const App = () => {
  const [isAdmin, setAdmin] = useState(true);
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
      {isAdmin ? <Admin /> : <Game />}
    </>
  );
};

export default App;
