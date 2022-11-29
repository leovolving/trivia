import { Card, Modal } from "@mui/material";

const GameQuestionModal = ({ questionId, questions, onClose }) => {
  if (!questionId) return null;
  const question = questions.find((q) => q.id === questionId);
  return (
    <Modal open onClose={onClose}>
      <Card>{question.question}</Card>
    </Modal>
  );
};

export default GameQuestionModal;
