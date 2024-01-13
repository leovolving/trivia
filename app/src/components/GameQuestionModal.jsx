import { useMemo } from "react";
import { Box, Typography } from "@mui/material";

import { Modal } from "../_ds";

import { MESSAGE_TYPES } from "../constants";
import { useAppContext } from "../ContextWrapper";

import { GameQuestionModalAdminForm, GameQuestionModalTeamForm } from ".";

const GameQuestionModal = ({ questionId, onClose }) => {
  const { isAdmin, questions, categories, gameId, sendWebSocketMessage } =
    useAppContext();

  const question = useMemo(
    () => questions.find((q) => q.id === questionId),
    [questionId, questions]
  );

  if (!questionId) return null;
  const addTeamPoints = (teamId) => {
    sendWebSocketMessage(MESSAGE_TYPES.CLIENT_TEAM_ADD_POINTS, {
      gameId,
      teamId,
      newPoints: question.points,
    });
  };

  const category = categories.find((c) => c.id === question.category);

  const close = () => {
    onClose();
  };

  const correctAnswerProvided = (q) => typeof q.correct === "number";

  return (
    <Modal open onClose={close}>
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
      <Typography variant="h4" id="question-label">
        {question.question}
      </Typography>
      {isAdmin || !correctAnswerProvided(question) ? (
        <GameQuestionModalAdminForm
          addTeamPoints={addTeamPoints}
          question={question}
        />
      ) : (
        <GameQuestionModalTeamForm
          addTeamPoints={addTeamPoints}
          question={question}
        />
      )}
    </Modal>
  );
};

export default GameQuestionModal;
