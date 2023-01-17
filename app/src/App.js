import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { Admin, Game, Menu } from "./pages";

import { VIEWS } from "./constants";
import { endpoint, json } from "./utils";
import { useAppContext } from "./ContextWrapper";

import "./index.css";

const App = () => {
  const {
    gameId,
    setGameId,
    isAdmin,
    setAdmin,
    view,
    setView,
    resetSubDocuments,
  } = useAppContext();

  const toggleAdmin = () => {
    setView((prev) => (prev === VIEWS.admin ? VIEWS.game : VIEWS.admin));
  };

  const resetGame = () => {
    const resetWarning =
      "Resetting game will mark all questions as unanswered and remove all teams. Are you sure?";

    if (!window.confirm(resetWarning)) return null;

    fetch(endpoint(`game/${gameId}/reset`), { method: "PUT" })
      .then(json)
      .then(resetSubDocuments)
      .catch(console.error);
  };

  const openMenu = () => {
    setGameId(null);
    setAdmin(false);
    resetSubDocuments();
  };

  return (
    <>
      <Card className="app-card" raised>
        <Typography variant="h1">Let's Get Trivial</Typography>
        <Button onClick={openMenu}>Main menu</Button>
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
      {gameId ? <>{view === VIEWS.admin ? <Admin /> : <Game />}</> : <Menu />}
    </>
  );
};

export default App;
