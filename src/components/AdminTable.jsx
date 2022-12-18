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
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  return (
    <Paper>
      <Button onClick={toggleModal}>New Question</Button>
      <Table aria-label="game questions">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell>
                {categories.find((c) => c.id === q.category).label}
              </TableCell>
              <TableCell>{q.question}</TableCell>
              <TableCell>{q.points}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" disabled>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AdminQuestionFormModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        questions={questions}
        setQuestions={setQuestions}
        categories={categories}
        setCategories={setCategories}
      />
    </Paper>
  );
};

export default AdminTable;
