const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5050;
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/trivia-data";

app.all("*", (req, res, next) => {
  const timestamp = new Date().getTime();
  console.log(`${timestamp} - ${req.method} request for ${req.path}`);

  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// health check
app.get("/hello", (_, res) => {
  res.status(200).send("hello");
});

try {
  mongoose.set({ strictQuery: true });
  mongoose.connect(DATABASE_URL, (err) => {
    if (err) {
      throw new Error(err);
    }
    app.listen(PORT, () => {
      console.log(`Your app is listening on port ${PORT}`);
    });
  });
} catch (e) {
  mongoose.disconnect();
}

module.exports = { app };
