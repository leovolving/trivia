import { useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";

const INITIAL_POINTS = 100;

// to be replaced with proper unique ID when connected to DB
const uuid = () => new Date().getTime();

const AdminQuestionFormModal = ({
  isOpen,
  onClose,
  questions,
  setQuestions,
  categories,
  setCategories,
}) => {
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
    <Modal open={isOpen} onClose={onClose} className="modal">
      <Card className="modal-card">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid",
          }}
        >
          <form id="new-question-form" onSubmit={onSubmit}>
            <FormLabel>
              Category
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
                sx={{ marginBottom: "25px" }}
              />
            </FormLabel>

            <TextField
              size="small"
              onChange={onTextFieldChange(setQuestion)}
              value={question}
              label="Question"
              required
            />

            <TextField
              size="small"
              onChange={onTextFieldChange(setPoints)}
              value={points}
              inputProps={{ type: "number" }}
              label="Points"
              required
            />

            <Button variant="contained" type="submit">
              Add
            </Button>
          </form>
        </Box>
      </Card>
    </Modal>
  );
};

export default AdminQuestionFormModal;
