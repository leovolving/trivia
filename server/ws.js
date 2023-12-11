const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");

const { DATABASE_URL } = require("./constants");
const { wsRoutes } = require("./ws-routes");

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

    const msgRoute = wsRoutes[data.type];
    if (msgRoute) {
      const payload = await msgRoute.fn(data, ws);
      // TODO: handle responses to more than just the requester
      ws.send(JSON.stringify({ type: msgRoute.responseMessage, payload }));
    } else {
      console.error("No msgRoute", data);
    }
  });
});

wss.on("error", console.error);
