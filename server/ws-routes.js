const { MESSAGE_TYPES } = require("./constants");

const {
  addCategory,
  addOrEditQuestion,
  addTeam,
  addTeamPoints,
  addTeamWithCode,
  createNewGame,
  deleteQuestion,
  getGameByCode,
  getGameById,
  resetGame,
  updateQuestionStatus,
} = require("./model-helpers");

const wsRoutes = {
  [MESSAGE_TYPES.CLIENT_ACTIVATED_QUESTION]: {
    responseMessage: MESSAGE_TYPES.SERVER_QUESTION_STATUS_UPDATED,
    fn: async ({ isActive, questionId }, ws) => {
      const status = { isAnswered: false, isActive };
      const g = await updateQuestionStatus(ws.gameId, questionId, status);
      return g.questions.id(questionId);
    },
  },
  [MESSAGE_TYPES.CLIENT_ADD_CATEGORY]: {
    responseMessage: MESSAGE_TYPES.SERVER_NEW_CATEGORY,
    fn: async (data) => {
      const { game, label } = data;
      const g = await addCategory(game, label);
      return g.categories.slice(-1)[0];
    },
  },
  [MESSAGE_TYPES.CLIENT_ADD_TEAM]: {
    responseMessage: MESSAGE_TYPES.SERVER_NEW_TEAM,
    fn: async (data) => {
      const { gameId, teamName } = data;
      const g = await addTeam(gameId, teamName);
      return g.teams.slice(-1)[0];
    },
  },
  [MESSAGE_TYPES.CLIENT_ADD_TEAM_WITH_CODE]: {
    responseMessage: MESSAGE_TYPES.SERVER_NEW_TEAM,
    fn: async (data) => {
      const { gameCode, teamName } = data;
      const g = await addTeamWithCode(gameCode, teamName);
      return g.teams.slice(-1)[0];
    },
  },
  [MESSAGE_TYPES.CLIENT_CREATE_GAME]: {
    isPrivate: true,
    responseMessage: MESSAGE_TYPES.SERVER_GAME_OBJECT,
    fn: async (data, ws) => {
      const newGame = await createNewGame();
      ws.gameCode = newGame.code;
      ws.gameId = newGame.id;
      ws.isAdmin = data.isAdmin;
      return newGame;
    },
  },
  [MESSAGE_TYPES.CLIENT_DELETE_QUESTION]: {
    responseMessage: MESSAGE_TYPES.SERVER_QUESTION_DELETED,
    fn: async (data) => {
      const { gameId, questionId } = data;
      await deleteQuestion(gameId, questionId);
      return { questionId };
    },
  },
  [MESSAGE_TYPES.CLIENT_JOIN_GAME]: {
    isPrivate: true,
    responseMessage: MESSAGE_TYPES.SERVER_GAME_OBJECT,
    fn: async (data, ws) => {
      ws.gameCode = data.gameCode;
      ws.isAdmin = data.isAdmin;
      let getGameFn;
      if (data.isCode) {
        getGameFn = getGameByCode;
      } else getGameFn = getGameById;
      const game = await getGameFn(data.key);
      ws.gameId = game.id;
      return game;
    },
  },
  [MESSAGE_TYPES.CLIENT_QUESTION_ANSWERED]: {
    responseMessage: MESSAGE_TYPES.SERVER_QUESTION_STATUS_UPDATED,
    fn: async (data) => {
      const { gameId, questionId } = data;
      const status = { isAnswered: true, isActive: false };
      const g = await updateQuestionStatus(gameId, questionId, status);
      return g.questions.id(questionId);
    },
  },
  [MESSAGE_TYPES.CLIENT_QUESTION_FORM]: {
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
  [MESSAGE_TYPES.CLIENT_RESET_GAME]: {
    responseMessage: MESSAGE_TYPES.SERVER_RESET_GAME,
    fn: async (data) => {
      return await resetGame(data.gameId);
    },
  },
  [MESSAGE_TYPES.CLIENT_TEAM_ADD_POINTS]: {
    responseMessage: MESSAGE_TYPES.SERVER_TEAM_POINTS_UPDATED,
    fn: async (data) => {
      const { gameId, teamId, newPoints } = data;
      const g = await addTeamPoints(gameId, teamId, newPoints);
      return g.teams.id(teamId);
    },
  },
};

module.exports = { wsRoutes };
