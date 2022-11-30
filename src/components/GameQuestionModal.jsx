import { Button, Box, Card, Modal, Typography } from "@mui/material";

const GameQuestionModal = ({
  questionId,
  questions,
  onClose,
  setQuestions,
  categories,
}) => {
  if (!questionId) return null;
  const question = questions.find((q) => q.id === questionId);
  const setIsAnswered = () => {
    const updatedQuestions = questions.map((q) => ({
      ...q,
      isAnswered: q.id === questionId || !!q.isAnswered,
    }));
    setQuestions(updatedQuestions);
  };
  const category = categories.find((c) => c.id === question.category);
  return (
    <Modal open onClose={onClose} className="question-modal">
      <Card className="question-modal-card">
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={setIsAnswered} variant="outlined">
            Mark completed
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default GameQuestionModal;
