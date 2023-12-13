const { Game } = require("./models");
const helpers = require("./helpers");

const addCategory = async (gameId, label) =>
  await Game.findByIdAndUpdate(
    gameId,
    { $push: { categories: { label } } },
    { new: true }
  );

const addOrEditQuestion = async (q, gameId, questionId) => {
  if (questionId) {
    return await Game.findOneAndUpdate(
      { _id: gameId, "questions._id": questionId },
      {
        $set: {
          "questions.$.question": q.question,
          "questions.$.answers": q.answers,
          "questions.$.points": q.points,
          "questions.$.category": q.category,
        },
      },
      { new: true }
    );
  } else {
    return await Game.findByIdAndUpdate(
      gameId,
      { $push: { questions: { ...q } } },
      { new: true }
    );
  }
};

const createNewGame = async () => Game.create({ code: helpers.generateCode() });

const getGameByCode = async (code) => await Game.findOne({ code });

const getGameById = async (id) => await Game.findById(id);

module.exports = {
  addOrEditQuestion,
  addCategory,
  createNewGame,
  getGameByCode,
  getGameById,
};
