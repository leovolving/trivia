import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { Admin, Game, Menu } from "./pages";

import { MESSAGE_TYPES, VIEWS } from "./constants";
import { useWebSocketCallback } from "./hooks";
import { useAppContext } from "./ContextWrapper";
import { transformId } from "./utils";

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
    setupGameState,
    setCategories,
    setQuestions,
    setTeams,
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

  const webSocketEventCallbacks = {
    [MESSAGE_TYPES.SERVER_GAME_OBJECT]: setupGameState,
    [MESSAGE_TYPES.SERVER_QUESTION_RESPONSE]: (data) => {
      if (data.newCategory) {
        setCategories((prev) => [...prev, transformId(data.newCategory)]);
      }
      setQuestions(data.questions.map(transformId));
    },
    [MESSAGE_TYPES.SERVER_NEW_TEAM]: (newTeam) => {
      setTeams((prev) => [...prev, transformId(newTeam)]);
    },
    [MESSAGE_TYPES.SERVER_QUESTION_DELETED]: ({ questionId }) => {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    },
    [MESSAGE_TYPES.SERVER_QUESTION_STATUS_UPDATED]: ({
      _id,
      isActive,
      isAnswered,
    }) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === _id ? { ...q, isAnswered, isActive } : q))
      );
    },
    [MESSAGE_TYPES.SERVER_RESET_GAME]: resetSubDocuments,
    [MESSAGE_TYPES.SERVER_TEAM_POINTS_UPDATED]: ({ _id, points }) => {
      setTeams((prev) =>
        prev.map((t) => (t.id === _id ? { ...t, points } : t))
      );
    },
  };

  useWebSocketCallback(webSocketEventCallbacks);

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
