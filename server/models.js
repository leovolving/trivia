const { Schema, model } = require("mongoose");

const options = { timestamps: true };

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
  },
  options
);

const categorySchema = new Schema(
  {
    label: { type: String, required: true },
  },
  options
);

const questionSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Game.categories" },
    question: { type: String, required: true },
    isAnswered: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    points: { type: Number, required: true },
    answers: [String],
    correct: Number, // index for the correct answer from the answers array
  },
  options
);

const gameSchema = new Schema(
  {
    name: String,
    code: { type: String, required: true },
    teams: [teamSchema],
    categories: [categorySchema],
    questions: [questionSchema],
  },
  options
);

const Game = model("Game", gameSchema);

module.exports = { Game };
