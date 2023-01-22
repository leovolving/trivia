import { useState } from "react";

import { Button, Card, TextField, Typography } from "@mui/material";

import { LoadingButton, Modal } from "../_ds";

import { transformId, endpoint, json, headers } from "../utils";
import { useAppContext } from "../ContextWrapper";

const AdminTeamsCard = () => {
  const { teams, setTeams, gameId } = useAppContext();

  const [isLoading, setLoading] = useState(false);
  const [isAddTeamsModalOpen, setAddTeamsModalOpen] = useState(false);
  const [teamInputs, setTeamInputs] = useState([]);

  const onTeamChange = (teamIndex) => (event) => {
    const newTeams = [...teamInputs];
    newTeams[teamIndex] = event.target.value;
    setTeamInputs(newTeams);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const addedTeams = teamInputs.filter(Boolean).map((name) =>
      fetch(endpoint("team/new"), {
        method: "POST",
        headers,
        body: JSON.stringify({ name, game: gameId }),
      })
        .then(json)
        .catch(console.error)
    );

    Promise.all(addedTeams)
      .then((res) => {
        setTeams([...teams, ...res.map(transformId)]);
        setTeamInputs([]);
        setAddTeamsModalOpen(false);
      })
      .catch(console.error)
      .finally(setLoading(false));
  };
  return (
    <Card sx={{ padding: "16px" }}>
      <Typography variant="h3" gutterBottom>
        Teams
      </Typography>
      <Button variant="contained" onClick={() => setAddTeamsModalOpen(true)}>
        + Add teams
      </Button>
      <ul>
        {teams.map((t) => (
          <Typography component="li" key={t.id}>
            {t.name}
          </Typography>
        ))}
      </ul>
      <Modal
        open={isAddTeamsModalOpen}
        onClose={() => setAddTeamsModalOpen(false)}
      >
        <>
          <Typography variant="h4" gutterBottom>
            Add teams
          </Typography>
          <form onSubmit={onSubmit}>
            {teamInputs.map((r, i) => (
              <TextField
                key={i}
                size="small"
                onChange={onTeamChange(i)}
                value={r}
                label={`Team ${i + 1}`}
                autoFocus
                sx={{ marginRight: "16px", marginBottom: "16px" }}
              />
            ))}
            <TextField
              key={teams.length}
              size="small"
              onChange={onTeamChange(teamInputs.length)}
              value={""}
              label={`Team ${teamInputs.length + 1}`}
              sx={{ marginRight: "16px", marginBottom: "16px" }}
            />
            <LoadingButton isLoading={isLoading} type="submit">
              Add teams
            </LoadingButton>
          </form>
        </>
      </Modal>
    </Card>
  );
};

export default AdminTeamsCard;
