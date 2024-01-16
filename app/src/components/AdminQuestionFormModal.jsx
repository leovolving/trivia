import { useState } from "react";

import { Autocomplete, FormLabel, TextField } from "@mui/material";

import { LoadingButton, Modal } from "../_ds";

import { MESSAGE_TYPES } from "../constants";
import { useAppContext } from "../ContextWrapper";

const INITIAL_POINTS = 100;

const AdminQuestionFormModal = ({ isOpen, onClose, editingQuestion }) => {
  const { categories, gameId, sendWebSocketMessage } = useAppContext();

  const isNew = !editingQuestion;
  const initialCategory = isNew
    ? null
    : categories.find((c) => c.id === editingQuestion.category);
  const currentOrDefault = (valueKey, defaultValue) =>
    isNew ? defaultValue : editingQuestion[valueKey];

  const [isLoading, setLoading] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [inputCategory, setInputCategory] = useState(
    initialCategory?.label || ""
  );
  const [question, setQuestion] = useState(currentOrDefault("question", ""));
  const [points, setPoints] = useState(
    currentOrDefault("points", INITIAL_POINTS)
  );
  const [answers, setAnswers] = useState(currentOrDefault("answers", []));
  const [correctAnswer, setCorrectAnswer] = useState(
    currentOrDefault("correct", null)
  );

  const clearInputs = () => {
    setCategory(null);
    setInputCategory("");
    setQuestion("");
    setPoints(INITIAL_POINTS);
    setAnswers([]);
  };

  const onCategoryChange = (_, value, reason) => {
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

  const onCorrectAnswerChange = (_, val) => {
    setCorrectAnswer(answers.indexOf(val));
  };

  const getOrCreateCategory = () => {
    if (category?.id) return category.id;
    const existingMatch = categories.find(
      (c) => c.label.toLowerCase() === inputCategory.toLowerCase()
    );
    if (existingMatch) return existingMatch.id;
  };

  const onTextFieldChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const onMultipleChoiceOptionChange = (answerIndex) => (event) => {
    const newAnswers = [...answers];
    newAnswers[answerIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  const fetchQuestion = async () => {
    setLoading(true);
    const categoryId = await getOrCreateCategory();
    // TODO: ensure there are no duplicate answer options
    const filteredAnswers = answers.filter(Boolean);
    // TODO: handle error if correctAnswerString is empty string
    const correctAnswerString = answers[correctAnswer];
    const correct = filteredAnswers.indexOf(correctAnswerString);
    const wsData = {
      gameId,
      categoryLabel: inputCategory,
      categoryId,
      isNewCategory: !categoryId,
      points: +points,
      answers: filteredAnswers,
      question,
      questionId: editingQuestion?.id,
      correct,
    };
    sendWebSocketMessage(MESSAGE_TYPES.CLIENT_QUESTION_FORM, wsData);
    setLoading(false);
    clearInputs();
    onClose();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await fetchQuestion();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <form id="new-question-form" onSubmit={onSubmit}>
        <FormLabel>
          Category
          <Autocomplete
            freeSolo
            options={categories}
            renderInput={(params) => (
              <TextField size="small" {...params} required />
            )}
            onChange={onCategoryChange}
            inputValue={inputCategory}
            onInputChange={onCategoryChange}
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

        <div>
          <h3>Correct answer</h3>
          <Autocomplete
            options={answers}
            value={answers[correctAnswer] || null}
            onChange={onCorrectAnswerChange}
            renderInput={(params) => <TextField {...params} />}
            ListboxProps={{ style: { maxHeight: 100 } }}
            disableClearable
            componentsProps={{
              popper: {
                modifiers: [
                  {
                    name: "flip",
                    options: {
                      fallbackPlacements: [],
                    },
                  },
                ],
              },
            }}
          />
        </div>

        <LoadingButton
          isLoading={isLoading}
          variant="contained"
          type="submit"
          sx={{ marginTop: "24px" }}
        >
          {isNew ? "Add" : "Save"}
        </LoadingButton>
      </form>
    </Modal>
  );
};

export default AdminQuestionFormModal;
