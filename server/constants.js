const MESSAGE_TYPES = {
  CLIENT_ADD_CATEGORY: "add-category",
  CLIENT_ADD_TEAM: "add-team",
  CLIENT_CREATE_GAME: "create",
  CLIENT_JOIN_GAME: "join",
  CLIENT_QUESTION_FORM: "question-form",
  SERVER_GAME_OBJECT: "game",
  SERVER_NEW_CATEGORY: "new-category",
  SERVER_NEW_TEAM: "new-team",
  SERVER_QUESTION_RESPONSE: "question-response",
};

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/trivia-data";

module.exports = { MESSAGE_TYPES, DATABASE_URL };
