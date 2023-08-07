const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRouter = require("./routers/userRouter");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const seedRouter = require("./routers/seedRouter");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15,
  message: "Too many request from this IP. Try later",
});

app.use(xssClean());
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to the server",
  });
});

//using Middleware for testing

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "Welcome to the server, Api is working good",
  });
});

//client error handling

app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

//server error handling

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
