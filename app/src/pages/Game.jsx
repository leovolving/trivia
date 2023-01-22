import { useState } from "react";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import { GameQuestionModal, Scoreboard } from "../components";
import { useAppContext } from "../ContextWrapper";

const Game = () => {
  const { categories, questions, isAdmin } = useAppContext();

  const [openQuestion, setOpenQuestion] = useState(null);
  const [isScoreboardOpen, setScoreboardOpen] = useState(false);

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
      <Typography variant="h2">Game Mode</Typography>
      <Button
        variant="contained"
        color="success"
        sx={{ marginBottom: "12px" }}
        onClick={() => setScoreboardOpen(true)}
      >
        Scoreboard
      </Button>
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
                        disabled={!q.isAnswered && !isAdmin}
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
        onClose={() => setOpenQuestion(null)}
      />
      <Scoreboard
        isOpen={isScoreboardOpen}
        onClose={() => setScoreboardOpen(false)}
      />
    </>
  );
};

export default Game;
