import { useState } from "react";
import {
  Autocomplete,
  Button,
  Box,
  Card,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import { endpoint, json, headers } from "../utils";
import { useAppContext } from "../ContextWrapper";

const GameQuestionModal = ({ questionId, onClose }) => {
  const { questions, setQuestions, categories, teams, setTeams, gameId } =
    useAppContext();

  const [correctTeams, setCorrectTeams] = useState([]);
  if (!questionId) return null;
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const question = questions.find((q) => q.id === questionId);

  const setIsAnswered = () => {
    const updatedQuestions = questions.map((q) => ({
      ...q,
      isAnswered: q.id === questionId || !!q.isAnswered,
    }));

    const pointsAwarded = correctTeams.map(({ id }) =>
      fetch(endpoint("team/add-points"), {
        method: "PUT",
        headers,
        body: JSON.stringify({ id, game: gameId, points: question.points }),
      }).catch(console.error)
    );

    Promise.all(pointsAwarded).then(() => {
      const updatedTeams = teams.map((t) => {
        if (correctTeams.findIndex(({ id }) => id === t.id) >= 0) {
          t.points += question.points;
        }
        return t;
      });
      setTeams(updatedTeams);
    });

    setQuestions(updatedQuestions);
    close();
  };

  const category = categories.find((c) => c.id === question.category);

  const close = () => {
    setCorrectTeams([]);
    onClose();
  };

  const onAutocompleteChange = (_, value) => {
    setCorrectTeams(value);
  };

  return (
    <Modal open onClose={close} className="modal">
      <Card className="modal-card">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid",
          }}
        >
          <Typography>Category: {category.label}</Typography>
          <Typography>{question.points} points</Typography>
        </Box>
        <Typography variant="h4">{question.question}</Typography>
        <ul className="answer-options-list">
          {question.answers.map((a, i) => (
            <Typography
              key={`answer-${i}-${question.id}`}
              variant="h5"
              component="li"
            >
              {a}
            </Typography>
          ))}
        </ul>
        <Typography variant="h5">Correct teams</Typography>
        <Autocomplete
          options={sortedTeams}
          getOptionLabel={(o) => o.name}
          multiple
          filterSelectedOptions
          disableCloseOnSelect
          value={correctTeams}
          onChange={onAutocompleteChange}
          renderInput={(params) => <TextField {...params} />}
          ListboxProps={{ style: { maxHeight: 100 } }}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "flip",
                  options: {
                    fallbackPlacements: [],
                  },
                },
              ],
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={setIsAnswered} variant="outlined">
            Complete question and close
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default GameQuestionModal;
