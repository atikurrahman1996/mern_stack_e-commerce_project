const express = require("express");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { isLoggeOut, isLoggedIn } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/login", isLoggeOut, handleLogin);
authRouter.post("/logout", isLoggedIn, handleLogout);

module.exports = authRouter;
