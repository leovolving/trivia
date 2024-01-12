import { useState } from "react";

import {
  Button,
  Card,
  Divider,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { MESSAGE_TYPES } from "../constants";
import { useAppContext } from "../ContextWrapper";

const Menu = () => {
  const { recentGames, openGame, sendWebSocketMessage, setAdmin } =
    useAppContext();

  const [gameCode, setGameCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [adminSwitchOn, setAdminSwitchOn] = useState(false);

  const toggleAdminSwitch = (event) => {
    setAdminSwitchOn(event.target.checked);
  };

  const createNewGame = () => {
    sendWebSocketMessage(MESSAGE_TYPES.CLIENT_CREATE_GAME, { isAdmin: true });
    setAdmin(true);
  };

  const onCodeChange = (event) => {
    const { value } = event.target;
    if (value.length < 5) setGameCode(value.toUpperCase());
  };

  const onTeamNameChange = (event) => {
    const { value } = event.target;
    setTeamName(value);
  };

  const joinGame = (e) => {
    e.preventDefault();
    if (!adminSwitchOn && teamName) {
      const data = { gameCode, teamName };
      sendWebSocketMessage(MESSAGE_TYPES.CLIENT_ADD_TEAM_WITH_CODE, data);
    }
    openGame(gameCode, true, adminSwitchOn);
  };

  return (
    <>
      <Typography variant="h2">Menu</Typography>
      <Card className="menu-card">
        <Typography gutterBottom variant="h3">
          New Game
        </Typography>
        <Typography gutterBottom>
          You will be able to add your own questions and be granted a unique
          code for others to join.
        </Typography>
        <Button variant="contained" onClick={createNewGame}>
          Create new game
        </Button>
      </Card>
      <Divider />
      <Card className="menu-card">
        <Typography gutterBottom variant="h3">
          Join a Game
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Friend sent you here? Enter the 4-character code they provided to join
          them!
        </Typography>
        <form onSubmit={joinGame}>
          <div className="menu-join-input">
            <div>
              <Typography
                gutterBottom
                component="label"
                htmlFor="code"
                sx={{ display: "block" }}
              >
                Code
              </Typography>
              <TextField value={gameCode} onChange={onCodeChange} name="code" />
            </div>
            {!adminSwitchOn && (
              <div>
                <Typography
                  gutterBottom
                  component="label"
                  htmlFor="team"
                  sx={{ display: "block" }}
                >
                  Team name
                </Typography>
                <TextField
                  value={teamName}
                  onChange={onTeamNameChange}
                  name="team"
                />
              </div>
            )}
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={adminSwitchOn}
                onChange={toggleAdminSwitch}
                color="success"
              />
            }
            label="Join as admin"
          />
          <Button variant="outlined" type="submit" sx={{ display: "block" }}>
            Join
          </Button>
        </form>
      </Card>
      <Divider />
      <Card className="menu-card">
        <Typography gutterBottom variant="h3">
          Recent Games
        </Typography>
        <Typography>Rejoin one of your recent games</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Last updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentGames.map((g) => (
                <TableRow key={g.code}>
                  <TableCell>{g.code}</TableCell>
                  <TableCell>
                    {new Date(g.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openGame(g._id, false, g.isAdmin)}>
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default Menu;
