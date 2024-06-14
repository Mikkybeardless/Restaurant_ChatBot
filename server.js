const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
// or const {creatServer} = require('node:http')
const socketio = require("socket.io");

const app = express();
// create a server from express
const server = http.createServer(app);
// mount server on socket.io
const io = socketio(server);

dotenv.config();
const PORT = 3000 || process.env.PORT;
const HOST = process.env.HOST;

// internal modules
const formatMessage = require("./util/messages");
const { handleUserInput } = require("./util/orders.js");
const {
  sessionMiddleware,
  sharedSession,
} = require("./middleware/session.middleware.js");

app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, "public")));

// Share session with Socket.IO
io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true,
  })
);

const botName = "Restaurant Bot";
const orders = {};
// run when client connects
io.on("connection", (socket) => {
  const sessionID = socket.handshake.sessionID;

  if (!orders[sessionID]) {
    orders[sessionID] = {
      currentOrder: [],
      orderHistory: [],
    };
  }
  socket.emit(
    "welcome",
    formatMessage(botName, "Welcome to Eat_Well Restaurant")
  );

  socket.on("selected option", (msg) => {
    handleUserInput(botName, socket, sessionID, orders, msg);
  });

  socket.on("disconnect", () => {
    console.log("user left", sessionID);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`server is active at http://${HOST}:${PORT}`);
});
