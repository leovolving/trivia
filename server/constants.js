const MESSAGE_TYPES = {
  CLIENT_ADD_CATEGORY: "add-category",
  CLIENT_ADD_TEAM: "add-team",
  CLIENT_CREATE_GAME: "create",
  CLIENT_DELETE_QUESTION: "delete-question",
  CLIENT_JOIN_GAME: "join",
  CLIENT_QUESTION_ANSWERED: "question-answered",
  CLIENT_QUESTION_FORM: "question-form",
  CLIENT_TEAM_ADD_POINTS: "add-points",
  SERVER_GAME_OBJECT: "game",
  SERVER_NEW_CATEGORY: "new-category",
  SERVER_NEW_TEAM: "new-team",
  SERVER_QUESTION_DELETED: "question-deleted",
  SERVER_QUESTION_RESPONSE: "question-response",
  SERVER_QUESTION_STATUS_UPDATED: "question-status-updated",
  SERVER_TEAM_POINTS_UPDATED: "team-points-updated",
};

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/trivia-data";

module.exports = { MESSAGE_TYPES, DATABASE_URL };
