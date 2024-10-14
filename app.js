require("dotenv").config();
const express = require("express");

// Create server with express
const http = require("http");
const { initSocket } = require("./socketio"); // Import initSocket

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// database
require("./config/database").connectdatabase();

//logger
const morgan = require("morgan");
app.use(morgan("tiny"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session & cookieparser

const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXP_SESS_SEC,
  })
);
app.use(cookieParser());

// routes
app.use("/user", require("./routes/userRoutes"));
app.use("/post", require("./routes/postRoutes"));
app.use("/notification", require("./routes/notificationsRouter"));

//error Handler
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedError } = require("./middlewares/generatedError");

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`req url not fond ${req.url}`));
});

app.use(generatedError);

server.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`);
});

module.exports = app;
