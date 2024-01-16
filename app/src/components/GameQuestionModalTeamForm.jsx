import { useState } from "react";

import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { useAppContext } from "../ContextWrapper";
import { getLetter } from "../utils";

const GameQuestionModalTeamForm = ({ addTeamPoints, question }) => {
  const { teamId } = useAppContext();

  const [selection, setSelection] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);

  const onChange = (e) => {
    setSelection(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (+selection === question.correct) {
      addTeamPoints(teamId);
      setAnswerFeedback("Yay! You got it!");
    } else {
      setAnswerFeedback("Oh no! That was incorrect.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={selection}
          onChange={onChange}
        >
          {question.answers.map((a, i) => (
            <FormControlLabel
              value={i}
              control={<Radio />}
              label={`${getLetter(i)}. ${a}`}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Typography>{answerFeedback}</Typography>
      <Button type="submit" variant="outlined" disabled={!!answerFeedback}>
        Submit answer
      </Button>
    </form>
  );
};

export default GameQuestionModalTeamForm;
