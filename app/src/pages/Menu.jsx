import { Button, Card, Divider, Typography } from "@mui/material";

import { endpoint, json } from "../utils";
const { VIEWS } = "../constants";

const Menu = ({
  setAdmin,
  adminGames,
  setAdminGames,
  setGameId,
  setView,
  setTeams,
  setCategories,
  setQuestions,
}) => {
  const createNewGame = () => {
    return fetch(endpoint("game/new"), { method: "POST" })
      .then(json)
      .then((g) => {
        setGameId(g._id);
        setAdminGames([...adminGames, g]);
        setAdmin(true);
        setView(VIEWS.admin);
        setTeams(g.teams);
        setCategories(g.categories);
        setQuestions(g.questions);
      })
      .catch(console.error);
  };

  const openGame = (id) => {
    return fetch(endpoint(`game/${id}`), { method: "GET" })
      .then(json)
      .then((g) => {
        setGameId(g._id);
        setAdmin(true);
        setView(VIEWS.admin);
        setTeams(g.teams);
        setCategories(g.categories);
        setQuestions(g.questions);
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
