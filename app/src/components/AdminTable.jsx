import { useState } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { AdminQuestionFormModal } from ".";
import { endpoint } from "../utils";
import { useAppContext } from "../ContextWrapper";

const AdminTable = () => {
  const { questions, categories, setQuestions, gameId } = useAppContext();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    toggleModal();
    setEditingQuestion(null);
  };

  const editQuestion = (q) => {
    setEditingQuestion(q);
    toggleModal();
  };

  const deleteQuestion = ({ question, id }) => {
    const deleteWarning = `Are you sure you want to delete the following question: ${question}`;
    if (!window.confirm(deleteWarning)) return;
    fetch(endpoint(`game/${gameId}/question/${id}`), { method: "DELETE" })
      .then(() => {
        setQuestions(questions.filter((q) => q.id !== id));
      })
      .catch(console.error);
  };

  return (
    <>
      <Button
        onClick={toggleModal}
        variant="contained"
        sx={{ marginBottom: "16px" }}
      >
        + New Question
      </Button>

      <Table aria-label="game questions">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Options</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...questions]
            .sort((a, b) =>
              a.category === b.category
                ? a.points - b.points
                : a.category - b.category
            )
            .map((q) => (
              <TableRow key={q.id}>
                <TableCell>
                  {categories.find((c) => c.id === q.category).label}
                </TableCell>
                <TableCell>{q.question}</TableCell>
                <TableCell>
                  {q.answers.length ? (
                    <ul className="answer-options-list">
                      {q.answers.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <i>N/A</i>
                  )}
                </TableCell>
                <TableCell>{q.points}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={() => editQuestion(q)}
                    sx={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    type="button"
                    onClick={() => deleteQuestion(q)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <AdminQuestionFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          editingQuestion={editingQuestion}
        />
      )}
    </>
  );
};

export default AdminTable;
