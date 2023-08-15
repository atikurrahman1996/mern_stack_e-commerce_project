const express = require("express");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { isLoggeOut, isLoggedIn } = require("../middleware/auth");
const { validateUserLogin } = require("../validators/auth");
const runValidation = require("../validators");

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggeOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);

module.exports = authRouter;
