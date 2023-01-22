import { useState } from "react";

import {
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { endpoint, json } from "../utils";
import { VIEWS } from "../constants";
import { useAppContext } from "../ContextWrapper";

const Menu = () => {
  const { setAdmin, adminGames, setAdminGames, setGameId, setView, openGame } =
    useAppContext();

  const [gameCode, setGameCode] = useState("");

  const createNewGame = () => {
    return fetch(endpoint("game/new"), { method: "POST" })
      .then(json)
      .then((g) => {
        setGameId(g._id);
        setAdminGames([...adminGames, g]);
        setAdmin(true);
        setView(VIEWS.admin);
      })
      .catch(console.error);
  };

  const onTextFieldChange = (event) => {
    const { value } = event.target;
    if (value.length < 5) setGameCode(value.toUpperCase());
  };

  const joinGame = (e) => {
    e.preventDefault();
    openGame(gameCode, true);
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
        <form onSubmit={joinGame}>
          <Typography
            gutterBottom
            component="label"
            htmlFor="code"
            sx={{ display: "block" }}
          >
            Enter the 4-character game code to join an existing game.
          </Typography>
          <div className="menu-join-input">
            <TextField
              value={gameCode}
              onChange={onTextFieldChange}
              name="code"
            />
            <Button variant="outlined" type="submit">
              Join
            </Button>
          </div>
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
              {adminGames.map((g) => (
                <TableRow key={g.code}>
                  <TableCell>{g.code}</TableCell>
                  <TableCell>
                    {new Date(g.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openGame(g._id)}>Join</Button>
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
