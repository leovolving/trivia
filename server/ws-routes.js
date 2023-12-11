const { MESSAGE_TYPES } = require("./constants");

const { getGameByCode, getGameById } = require("./model-helpers");

const wsRoutes = {
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
};

module.exports = { wsRoutes };
