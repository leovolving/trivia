import { useState } from "react";

import {
  Autocomplete,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";

import { MESSAGE_TYPES } from "../constants";
import { useAppContext } from "../ContextWrapper";

const GameQuestionModalAdminForm = ({ addTeamPoints, question }) => {
  const { teams, gameId, isAdmin, sendWebSocketMessage } = useAppContext();

  const [correctTeams, setCorrectTeams] = useState([]);
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const onAutocompleteChange = (_, value) => {
    setCorrectTeams(value);
  };

  const setIsAnswered = async () => {
    correctTeams.forEach(({ id }) => {
      addTeamPoints(id);
    });

    sendWebSocketMessage(MESSAGE_TYPES.CLIENT_QUESTION_ANSWERED, {
      gameId,
      questionId: question.id,
    });

    setCorrectTeams([]);
  };
  return (
    <>
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
      {isAdmin && (
        <>
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
        </>
      )}
    </>
  );
};

export default GameQuestionModalAdminForm;
