const session = require("express-session");
const dotenv = require("dotenv");
const sharedSession = require("express-socket.io-session");

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 },
});

module.exports = { sessionMiddleware, sharedSession };
