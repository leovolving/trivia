import { useState } from "react";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

import { GameQuestionModal } from "../components";

const Game = ({ categories, questions }) => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const getQuestionsForCategory = (categoryId) => {
    return questions
      .filter((q) => q.category === categoryId)
      .sort((a, b) => a.points - b.points);
  };

  return (
    <>
      <Typography variant="h2">Game</Typography>
      <ul className="game-board normalized-ul">
        {categories.map((c) => (
          <li key={c.id}>
            <Typography variant="h3">{c.label}</Typography>
            <ul className="normalized-ul">
              {getQuestionsForCategory(c.id).map((q) => (
                <li className="game-questions" key={q.id}>
                  <Card>
                    <CardActionArea onClick={() => setOpenQuestion(q.id)}>
                      <CardContent>{q.points}</CardContent>
                    </CardActionArea>
                  </Card>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <GameQuestionModal
        questionId={openQuestion}
        questions={questions}
        onClose={() => setOpenQuestion(null)}
      />
    </>
  );
};

export default Game;
