import { Button, Card, Divider, Typography } from "@mui/material";

import { endpoint, json } from "../utils";
import { VIEWS } from "../constants";
import { useAppContext } from "../ContextWrapper";

const Menu = () => {
  const { setAdmin, adminGames, setAdminGames, setGameId, setView, openGame } =
    useAppContext();

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

  return (
    <>
      <Typography variant="h2">Menu</Typography>
      <Card>
        <Typography variant="h3">New Game</Typography>
        <Button onClick={createNewGame}>Create new game</Button>
      </Card>
      <Divider />
      <Card>
        <Typography variant="h3">Return to an Existing Game</Typography>
        {adminGames.map(({ code, _id }) => (
          <Button key={code} onClick={() => openGame(_id)}>
            {code}
          </Button>
        ))}
      </Card>
    </>
  );
};

export default Menu;
