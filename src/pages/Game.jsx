import { useState } from "react";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

import { GameQuestionModal } from "../components";

const Game = ({ categories, questions, setQuestions }) => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const activeCategories = categories.filter((c) =>
    questions.some((q) => q.category === c.id)
  );

  const getQuestionsForCategory = (categoryId) => {
    return questions
      .filter((q) => q.category === categoryId)
      .sort((a, b) => a.points - b.points);
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Game Mode
      </Typography>
      <Card sx={{ padding: "16px" }} raised>
        <ul className="game-board normalized-ul">
          {activeCategories.map((c) => (
            <li key={c.id}>
              <Typography variant="h3" sx={{ textTransform: "capitalize" }}>
                {c.label}
              </Typography>
              <ul className="normalized-ul">
                {getQuestionsForCategory(c.id).map((q) => (
                  <li className="game-questions" key={q.id}>
                    <Card className=".game-question">
                      <CardActionArea
                        onClick={() => setOpenQuestion(q.id)}
                        className={
                          q.isAnswered ? "game-question__answered" : ""
                        }
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <b>{q.points}</b>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Card>
      <GameQuestionModal
        questionId={openQuestion}
        questions={questions}
        onClose={() => setOpenQuestion(null)}
        setQuestions={setQuestions}
        categories={categories}
      />
    </>
  );
};

export default Game;
