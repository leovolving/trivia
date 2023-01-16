const { Schema, model } = require("mongoose");

const teamSchema = new Schema({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
});

const categorySchema = new Schema({
  label: { type: String, required: true },
});

const questionSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Game.categories" },
  question: { type: String, required: true },
  isAnswered: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  points: { type: Number, required: true },
  answers: [String],
  correct: Number,
});

const gameSchema = new Schema({
  name: String,
  code: { type: String, required: true },
  teams: [teamSchema],
  categories: [categorySchema],
  questions: [questionSchema],
});

const Game = model("Game", gameSchema);

module.exports = { Game };
