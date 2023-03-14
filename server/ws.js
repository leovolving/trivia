const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");

const { Game } = require("./models");
const { DATABASE_URL, MESSAGE_TYPES } = require("./constants");

const wss = new WebSocketServer({ port: 5150, host: "localhost" }, () => {
  console.log("Server started on port 5150");

  try {
    mongoose.set({ strictQuery: true });
    mongoose.connect(DATABASE_URL, (err) => {
      console.log("connected to db");
      if (err) {
        throw new Error(err);
      }
    });
  } catch (e) {
    mongoose.disconnect();
  }
});

wss.on("connection", (ws, _request) => {
  console.log("clients: ", wss.clients.size);

  ws.on("message", async (_data) => {
    const data = JSON.parse(_data);

    switch (data.type) {
      case MESSAGE_TYPES.CLIENT_JOIN_GAME:
        ws.gameCode = data.gameCode;
        ws.isAdmin = data.isAdmin;
        console.log(data);
        const g = await Game.findOne({ code: data.gameCode });
        ws.send(
          JSON.stringify({ type: MESSAGE_TYPES.SERVER_GAME_OBJECT, game: g })
        );
      default:
        console.log(data);
    }
  });
});

wss.on("error", console.error);
