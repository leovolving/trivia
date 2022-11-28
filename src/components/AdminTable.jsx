import { useState } from "react";

import {
  Autocomplete,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const INITIAL_POINTS = 100;

// to be replaced with proper unique ID when connected to DB
const uuid = () => new Date().getTime();

const AdminTable = ({ questions, categories, setQuestions, setCategories }) => {
  const [category, setCategory] = useState(null);
  const [inputCategory, setInputCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [points, setPoints] = useState(INITIAL_POINTS);

  const clearInputs = () => {
    setCategory(null);
    setInputCategory("");
    setQuestion("");
    setPoints(INITIAL_POINTS);
  };

  const onAutocompleteChange = (_, value, reason) => {
    switch (reason) {
      case "clear":
      case "reset":
        setInputCategory("");
        setCategory(value);
        break;
      case "input":
        setInputCategory(value);
        setCategory(null);
        break;
      case "selectOption":
        setInputCategory(value.label);
        setCategory(value);
        break;
      default:
      // do nothing for blur
    }
  };

  const getOrCreateCategory = () => {
    if (category?.id) return category.id;
    const existingMatch = categories.find(
      (c) => c.label.toLowerCase() === inputCategory.toLowerCase()
    );
    if (existingMatch) return existingMatch.id;
    const id = uuid();
    setCategories([{ id, label: inputCategory }, ...categories]);
    return id;
  };

  const onTextFieldChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      question,
      points: +points,
      id: uuid(),
      createdAt: new Date(),
      isAnswered: false,
      category: getOrCreateCategory(),
    };

    setQuestions([newQuestion, ...questions]);
    clearInputs();
  };

  return (
    <Paper>
      <form id="new-question-form" onSubmit={onSubmit}>
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
            <TableRow>
              <TableCell>
                <Autocomplete
                  freeSolo
                  options={categories}
                  renderInput={(params) => (
                    <TextField size="small" {...params} required />
                  )}
                  onChange={onAutocompleteChange}
                  inputValue={inputCategory}
                  onInputChange={onAutocompleteChange}
                  value={category}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  onChange={onTextFieldChange(setQuestion)}
                  value={question}
                  required
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  onChange={onTextFieldChange(setPoints)}
                  value={points}
                  inputProps={{ type: "number" }}
                  required
                />
              </TableCell>
              <TableCell>
                <Button variant="contained" type="submit">
                  Add
                </Button>
              </TableCell>
            </TableRow>
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
      </form>
    </Paper>
  );
};

export default AdminTable;
