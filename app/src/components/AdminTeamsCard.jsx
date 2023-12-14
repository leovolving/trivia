import { useState } from "react";

import { Button, Card, TextField, Typography } from "@mui/material";

import { LoadingButton, Modal } from "../_ds";

import { MESSAGE_TYPES } from "../constants";
import { useAppContext } from "../ContextWrapper";

const AdminTeamsCard = () => {
  const { teams, gameId, sendWebSocketMessage } = useAppContext();

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

    teamInputs.filter(Boolean).forEach((teamName) => {
      sendWebSocketMessage(MESSAGE_TYPES.CLIENT_ADD_TEAM, { teamName, gameId });
    });

    setTeamInputs([]);
    setLoading(false);
    setAddTeamsModalOpen(false);
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
