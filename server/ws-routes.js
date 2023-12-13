const { MESSAGE_TYPES } = require("./constants");

const {
  addCategory,
  addOrEditQuestion,
  createNewGame,
  getGameByCode,
  getGameById,
} = require("./model-helpers");

const wsRoutes = {
  [MESSAGE_TYPES.CLIENT_ADD_CATEGORY]: {
    // TODO: send to all game participants
    responseMessage: MESSAGE_TYPES.SERVER_NEW_CATEGORY,
    fn: async (data) => {
      const { game, label } = data;
      const g = await addCategory(game, label);
      return g.categories.slice(-1)[0];
    },
  },
  [MESSAGE_TYPES.CLIENT_CREATE_GAME]: {
    responseMessage: MESSAGE_TYPES.SERVER_GAME_OBJECT,
    fn: async (_, ws) => {
      const newGame = await createNewGame();
      ws.gameCode = newGame.gameCode;
      ws.isAdmin = newGame.isAdmin;
      return newGame;
    },
  },
  [MESSAGE_TYPES.CLIENT_JOIN_GAME]: {
    responseMessage: MESSAGE_TYPES.SERVER_GAME_OBJECT,
    fn: async (data, ws) => {
      let getGameFn;
      if (data.isCode) {
        // TODO: maybe also set when not isCode?
        ws.gameCode = data.gameCode;
        ws.isAdmin = data.isAdmin;
        getGameFn = getGameByCode;
      } else getGameFn = getGameById;
      return getGameFn(data.key);
    },
  },
  [MESSAGE_TYPES.CLIENT_QUESTION_FORM]: {
    // TODO: send to all game participants
    responseMessage: MESSAGE_TYPES.SERVER_QUESTION_RESPONSE,
    fn: async (data) => {
      const {
        gameId,
        categoryLabel,
        categoryId,
        isNewCategory,
        points,
        answers,
        question,
        questionId,
      } = data;
      let category, newCategory;
      if (isNewCategory) {
        const g = await addCategory(gameId, categoryLabel);
        newCategory = g.categories.slice(-1)[0];
        category = newCategory._id;
      } else category = categoryId;
      const questionData = { points, answers, question, category };
      const game = await addOrEditQuestion(questionData, gameId, questionId);
      return {
        newCategory,
        questions: game.questions,
      };
    },
  },
};

module.exports = { wsRoutes };
