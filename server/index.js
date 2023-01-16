const express = require("express");

const app = express();
const port = process.env.PORT || 5050;

app.all("*", (req, res, next) => {
  const timestamp = new Date().getTime();
  console.log(`${timestamp} - ${req.method} request for ${req.path}`);

  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/hello", (_, res) => {
  res.status(200).send("hello");
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
