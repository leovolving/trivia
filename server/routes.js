const { Router } = require("express");

const { Game } = require("./models");
const {
  addCategory,
  addOrEditQuestion,
  addTeam,
  createNewGame,
  getGameByCode,
  getGameById,
} = require("./model-helpers");

const router = new Router();

router.post("/game/new", (_, res, next) => {
  createNewGame()
    .then((game) => res.status(201).json(game))
    .catch(next);
});

router.post("/category/new", (req, res, next) => {
  const { label, game } = req.body;
  addCategory(game, label)
    .then((g) => res.status(201).json(g.categories.slice(-1)[0]))
    .catch(next);
});

router.post("/question/new", (req, res, next) => {
  const { game, ...rest } = req.body;
  addOrEditQuestion(rest, game)
    .then((g) => res.status(201).json(g.questions.slice(-1)[0]))
    .catch(next);
});

router.post("/team/new", (req, res, next) => {
  const { game, name } = req.body;
  addTeam(game, name)
    .then((g) => res.status(201).json(g.teams.slice(-1)[0]))
    .catch(next);
});

router.get("/game/:id", (req, res, next) => {
  getGameById(req.params.id)
    .then((g) => res.status(200).json(g))
    .catch(next);
});

router.get("/game/code/:code", (req, res, next) => {
  const { code } = req.params;
  getGameByCode(code)
    .then((g) => res.status(200).json(g))
    .catch(next);
});

router.put("/team/add-points", (req, res, next) => {
  const { id, points, game } = req.body;
  Game.findOneAndUpdate(
    { _id: game, "teams._id": id },
    { $inc: { "teams.$.points": points } }
  )
    .then(() => res.status(204).send())
    .catch(next);
});

router.put("/game/:id/question/:questionId/answer", (req, res, next) => {
  Game.findOneAndUpdate(
    { _id: req.params.id, "questions._id": req.params.questionId },
    { $set: { "questions.$.isAnswered": true, "questions.$.isActive": false } }
  )
    .then(() => res.status(204).send())
    .catch(next);
});

router.put("/question/:id/edit", (req, res, next) => {
  const { game, ...rest } = req.body;

  addOrEditQuestion(rest, game, req.params.id)
    .then(() => res.status(204).send())
    .catch(next);
});

router.put("/game/:id/reset", async (req, res, next) => {
  const game = await getGameById(req.params.id);
  const teams = game.teams.map((t) => ({
    ...t,
    _doc: { ...t._doc, points: 0 },
  }));
  const questions = game.questions.map((q) => ({
    ...q,
    _doc: { ...q._doc, isAnswered: false, isActive: false },
  }));

  Game.findByIdAndUpdate(
    req.params.id,
    { $set: { questions, teams } },
    { new: true }
  )
    .then((g) => res.status(200).send(g))
    .catch(next);
});

router.delete("/game/:id/question/:questionId", async (req, res, next) => {
  const game = await getGameById(req.params.id);
  game.questions.id(req.params.questionId).remove();
  game.save((err) => {
    if (err) return next(err);
    res.status(204).send();
  });
});

module.exports = { router };
