const express = require("express");
const getUser = require("../controllers/userController");
const userRouter = express.Router();

// GET:/api/users

userRouter.get("/", getUser);

module.exports = userRouter;
