const { Game } = require("./models");
const helpers = require("./helpers");

const createNewGame = async () => Game.create({ code: helpers.generateCode() });

const getGameByCode = async (code) => await Game.findOne({ code });

const getGameById = async (id) => await Game.findById(id);

module.exports = { createNewGame, getGameByCode, getGameById };
