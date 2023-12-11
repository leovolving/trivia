const { Game } = require("./models");

const getGameByCode = async (code) => await Game.findOne({ code });

const getGameById = async (id) => await Game.findById(id);

module.exports = { getGameByCode, getGameById };
