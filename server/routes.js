const { Router } = require("express");

const { Game } = require("./models");
const helpers = require("./helpers");

const router = new Router();

router.post("/game/new", (_, res, next) => {
  Game.create({ code: helpers.generateCode() })
    .then((game) => res.status(201).json(game))
    .catch(next);
});

router.post("/category/new", (req, res, next) => {
  const { label, game } = req.body;
  Game.findByIdAndUpdate(
    game,
    { $push: { categories: { label } } },
    { new: true }
  )
    .then((g) => res.status(201).json(g.categories.slice(-1)[0]))
    .catch(next);
});

router.post("/question/new", (req, res, next) => {
  const { game, ...rest } = req.body;
  Game.findByIdAndUpdate(
    game,
    { $push: { questions: { ...rest } } },
    { new: true }
  )
    .then((g) => res.status(201).json(g.questions.slice(-1)[0]))
    .catch(next);
});

router.post("/team/new", (req, res, next) => {
  const { game, name } = req.body;
  Game.findByIdAndUpdate(game, { $push: { teams: { name } } }, { new: true })
    .then((g) => res.status(201).json(g.teams.slice(-1)))
    .catch(next);
});

router.get("/game/:id", (req, res, next) => {
  Game.findById(req.params.id)
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

router.put("/question/answer", (req, res, next) => {
  const { id, game } = req.body;
  Game.findOneAndUpdate(
    { _id: game, "questions._id": id },
    { $set: { "questions.$.isAnswered": true, "questions.$.isActive": false } }
  )
    .then(() => res.status(204).send())
    .catch(next);
});

router.put("/question/:id/edit", (req, res, next) => {
  const { game, question, answers, points, category } = req.body;
  Game.findOneAndUpdate(
    { _id: game, "questions._id": req.params.id },
    {
      $set: {
        "questions.$.question": question,
        "questions.$.answers": answers,
        "questions.$.points": points,
        "questions.$.category": category,
      },
    }
  )
    .then(() => res.status(204).send())
    .catch(next);
});

router.put("/game/:id/reset", async (req, res, next) => {
  const game = await Game.findById(req.params.id);
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
  const game = await Game.findById(req.params.id);
  game.questions.id(req.params.questionId).remove();
  game.save((err) => {
    if (err) return next(err);
    res.status(204).send();
  });
});

module.exports = { router };
