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

const addTeam = async (gameId, teamName) =>
  await Game.findByIdAndUpdate(
    gameId,
    { $push: { teams: { name: teamName } } },
    { new: true }
  );

const addTeamPoints = async (gameId, teamId, additionalPoints) =>
  await Game.findOneAndUpdate(
    { _id: gameId, "teams._id": teamId },
    { $inc: { "teams.$.points": additionalPoints } },
    { new: true }
  );

const createNewGame = async () => Game.create({ code: helpers.generateCode() });

const deleteQuestion = async (gameId, questionId, callback = () => {}) => {
  const game = await getGameById(gameId);
  game.questions.id(questionId).remove();
  game.save(callback);
};

const getGameByCode = async (code) => await Game.findOne({ code });

const getGameById = async (id) => await Game.findById(id);

const updateQuestionStatus = async (gameId, questionId, status) =>
  await Game.findOneAndUpdate(
    { _id: gameId, "questions._id": questionId },
    {
      $set: {
        "questions.$.isAnswered": status.isAnswered,
        "questions.$.isActive": status.isActive,
      },
    },
    { new: true }
  );

module.exports = {
  addOrEditQuestion,
  addCategory,
  addTeam,
  addTeamPoints,
  createNewGame,
  deleteQuestion,
  getGameByCode,
  getGameById,
  updateQuestionStatus,
};
