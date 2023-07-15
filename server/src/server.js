const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using Middleware

const isLoggedIn = (req, res, next) => {
  const login = false;
  if (login) {
    req.body.id = 101;
    next();
  } else {
    return res.status(401).json({ message: "login first" });
  }
};

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "Welcome to the server, Api is working good",
  });
});

app.get("/api/user", isLoggedIn, (req, res) => {
  res.status(200).send({
    message: "User profile is returned",
  });
});

app.listen(PORT, () => {
  console.log(`the server is running at http://localhost:${PORT}`);
});
