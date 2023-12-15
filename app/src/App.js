import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { Admin, Game, Menu } from "./pages";

import { MESSAGE_TYPES, VIEWS } from "./constants";
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
    adminGames,
    sendWebSocketMessage,
  } = useAppContext();

  const toggleAdmin = () => {
    setView((prev) => (prev === VIEWS.admin ? VIEWS.game : VIEWS.admin));
  };

  const resetGame = () => {
    const resetWarning =
      "Resetting game will mark all questions as unanswered and reset all teams' points to 0. Are you sure?";

    if (window.confirm(resetWarning)) {
      sendWebSocketMessage(MESSAGE_TYPES.CLIENT_RESET_GAME, { gameId });
    }
  };

  const openMenu = () => {
    setGameId(null);
    setAdmin(false);
    resetSubDocuments();
  };

  return (
    <>
      <Card className="app-card" raised>
        <Typography variant="h2" component="h1">
          Let's Get Trivial
        </Typography>
        <div className="app-card-menu">
          <Typography>
            Game code:{" "}
            {adminGames.find(({ _id }) => _id === gameId)?.code || "N/A"}
          </Typography>
          <Button variant="outlined" onClick={openMenu}>
            Main menu
          </Button>
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
        </div>
      </Card>
      {gameId ? view === VIEWS.admin ? <Admin /> : <Game /> : <Menu />}
    </>
  );
};

export default App;
