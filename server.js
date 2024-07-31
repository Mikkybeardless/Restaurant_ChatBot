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
const HOST = process.env.HOST || "localhost";

// internal modules
const formatMessage = require("./util/messages");
const { handleUserInput } = require("./util/orders.js");
const {
  sessionMiddleware,
  sharedSession,
} = require("./middleware/session.middleware.js");
const { newCustomer } = require("./util/customer.js");

app.use(sessionMiddleware);

// register view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index.html", (req, res) => {
  const username = req.query.username;
  res.redirect(`/restaurant?username=${encodeURIComponent(username)}`);
});

app.get("/restaurant", (req, res) => {
  const username = req.query.username;
  res.render("restaurant", { username });
});

// Share session with Socket.IO
io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true,
  })
);

const botName = "Restaurant Bot";
const order = {};
const users = [];

// function newCustomer(username, id) {
//   const user = {
//     username,
//     id,
//   };
//   users.push(user);
//   return user;
// }
// run when client connects
io.on("connection", (socket) => {
  const sessionID = socket.handshake.sessionID;
  socket.on("Customer join", ({ username }) => {
    const userId = sessionID + username;
    const user = newCustomer(username, userId, users);
    console.log("Customer joined", user.username);
    console.log("customer id", user.id);
    if (!order[userId]) {
      order[userId] = {
        currentOrder: [],
        orderHistory: [],
        total: 0,
      };
    }
    socket.emit(
      "welcome",
      formatMessage(
        botName,
        `Welcome to Eat_Well Restaurant <strong>${user.username}</strong>`
      )
    );

    socket.on("selected option", (msg) => {
      handleUserInput(botName, socket, userId, order, msg);
    });
    socket.on("disconnect", () => {
      console.log("Customer  left", user.username);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`server is active at http://${HOST}:${PORT}`);
});
