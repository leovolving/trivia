const { MESSAGE_TYPES } = require("./constants");

const {
  addCategory,
  addOrEditQuestion,
  addTeam,
  addTeamPoints,
  createNewGame,
  deleteQuestion,
  getGameByCode,
  getGameById,
  updateQuestionStatus,
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
  [MESSAGE_TYPES.CLIENT_ADD_TEAM]: {
    // TODO: send to all game participants
    responseMessage: MESSAGE_TYPES.SERVER_NEW_TEAM,
    fn: async (data) => {
      const { gameId, teamName } = data;
      const g = await addTeam(gameId, teamName);
      return g.teams.slice(-1)[0];
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
  [MESSAGE_TYPES.CLIENT_DELETE_QUESTION]: {
    // TODO: send to all game participants
    responseMessage: MESSAGE_TYPES.SERVER_QUESTION_DELETED,
    fn: async (data) => {
      const { gameId, questionId } = data;
      await deleteQuestion(gameId, questionId);
      return { questionId };
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
  [MESSAGE_TYPES.CLIENT_QUESTION_ANSWERED]: {
    // TODO: send to all game participants
    responseMessage: MESSAGE_TYPES.SERVER_QUESTION_STATUS_UPDATED,
    fn: async (data) => {
      const { gameId, questionId } = data;
      const status = { isAnswered: true, isActive: false };
      const g = await updateQuestionStatus(gameId, questionId, status);
      return g.questions.id(questionId);
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
  [MESSAGE_TYPES.CLIENT_TEAM_ADD_POINTS]: {
    // TODO: send to all game participants
    responseMessage: MESSAGE_TYPES.SERVER_TEAM_POINTS_UPDATED,
    fn: async (data) => {
      const { gameId, teamId, newPoints } = data;
      const g = await addTeamPoints(gameId, teamId, newPoints);
      return g.teams.id(teamId);
    },
  },
};

module.exports = { wsRoutes };
