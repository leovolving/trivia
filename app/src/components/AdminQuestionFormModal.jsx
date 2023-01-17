import { useState } from "react";

import {
  Autocomplete,
  Button,
  Card,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";

import { json, endpoint } from "../utils";

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
  gameId,
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

    return fetch(endpoint("category/new"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ label: inputCategory, game: gameId }),
    })
      .then(json)
      .then((c) => {
        setCategories([{ ...c, id: c._id }, ...categories]);
        return c._id;
      })
      .catch(console.error);
  };

  const onTextFieldChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const onMultipleChoiceOptionChange = (answerIndex) => (event) => {
    const newAnswers = [...answers];
    newAnswers[answerIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isNew) {
      const newQuestion = {
        question,
        points: +points,
        id: uuid(),
        createdAt: new Date(),
        isAnswered: false,
        answers: answers.filter(Boolean),
        category: await getOrCreateCategory(),
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

          <div className="question-form-points-container">
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
          </div>

          <div>
            <h3>Multiple choice options (optional)</h3>
            {answers.map((a, i) => (
              <TextField
                key={i}
                size="small"
                onChange={onMultipleChoiceOptionChange(i)}
                value={a}
                label={`option ${i + 1}`}
                autoFocus
                sx={{ marginRight: "16px", marginBottom: "16px" }}
              />
            ))}
            <TextField
              key={answers.length}
              size="small"
              onChange={onMultipleChoiceOptionChange(answers.length)}
              value={""}
              label={`option ${answers.length + 1}`}
              sx={{ marginRight: "16px", marginBottom: "16px" }}
            />
          </div>

          <Button variant="contained" type="submit" sx={{ marginTop: "24px" }}>
            {isNew ? "Add" : "Save"}
          </Button>
        </form>
      </Card>
    </Modal>
  );
};

export default AdminQuestionFormModal;
