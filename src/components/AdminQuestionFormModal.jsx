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
  editingQuestion,
}) => {
  const isNew = !editingQuestion;
  const initialCategory = isNew
    ? null
    : categories.find((c) => c.id === editingQuestion.category);
  const currentOrDefault = (valueKey, defaultValue) =>
    isNew ? defaultValue : editingQuestion[valueKey];

  const [category, setCategory] = useState(initialCategory);
  const [inputCategory, setInputCategory] = useState(
    initialCategory?.label || ""
  );
  const [question, setQuestion] = useState(currentOrDefault("question", ""));
  const [points, setPoints] = useState(
    currentOrDefault("points", INITIAL_POINTS)
  );
  const [answers, setAnswers] = useState(currentOrDefault("answers", []));

  const clearInputs = () => {
    setCategory(null);
    setInputCategory("");
    setQuestion("");
    setPoints(INITIAL_POINTS);
    setAnswers([]);
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

  const onMultipleChoiceOptionChange = (answerIndex) => (event) => {
    const newAnswers = [...answers];
    newAnswers[answerIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (isNew) {
      const newQuestion = {
        question,
        points: +points,
        id: uuid(),
        createdAt: new Date(),
        isAnswered: false,
        answers: answers.filter(Boolean),
        category: getOrCreateCategory(),
      };

      setQuestions([newQuestion, ...questions]);
      clearInputs();
    } else {
      const updatedQuestions = questions.map((q) =>
        q.id !== editingQuestion.id
          ? q
          : {
              ...q,
              question,
              points: +points,
              answers: answers.filter(Boolean),
              category: getOrCreateCategory(),
            }
      );

      setQuestions(updatedQuestions);
      onClose();
    }
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

            <div>
              <h3>Multiple choice options</h3>
              {answers.map((a, i) => (
                <TextField
                  key={i}
                  size="small"
                  onChange={onMultipleChoiceOptionChange(i)}
                  value={a}
                  label={`option ${i + 1}`}
                  autoFocus
                />
              ))}
              <TextField
                key={answers.length}
                size="small"
                onChange={onMultipleChoiceOptionChange(answers.length)}
                value={""}
                label={`option ${answers.length + 1}`}
              />
            </div>

            <Button variant="contained" type="submit">
              {isNew ? "Add" : "Save"}
            </Button>
          </form>
        </Box>
      </Card>
    </Modal>
  );
};

export default AdminQuestionFormModal;
