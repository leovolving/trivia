const MESSAGE_TYPES = {
  CLIENT_JOIN_GAME: "join",
  SERVER_GAME_OBJECT: "game",
};

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/trivia-data";

module.exports = { MESSAGE_TYPES, DATABASE_URL };
