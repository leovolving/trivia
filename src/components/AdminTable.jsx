import { useState } from "react";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { AdminQuestionFormModal } from ".";

const AdminTable = ({ questions, categories, setQuestions, setCategories }) => {
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
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <Paper>
      <Button onClick={toggleModal}>New Question</Button>
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
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell>
                {categories.find((c) => c.id === q.category).label}
              </TableCell>
              <TableCell>{q.question}</TableCell>
              <TableCell>
                {q.answers.length ? (
                  <ul className="answer-options-list">
                    {q.answers.map((a) => (
                      <li>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <i>N/A</i>
                )}
              </TableCell>
              <TableCell>{q.points}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => editQuestion(q)}
                  sx={{ marginRight: "8px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
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
          questions={questions}
          setQuestions={setQuestions}
          categories={categories}
          setCategories={setCategories}
          editingQuestion={editingQuestion}
        />
      )}
    </Paper>
  );
};

export default AdminTable;
