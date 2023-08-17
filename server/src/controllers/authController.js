const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtAccesskey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "user does not exist with this email. please register first"
      );
    }
    //compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email or password does not match");
    }

    //isBanned
    if (user.isBanned) {
      throw createError(403, "Your are banned.");
    }

    //token, cookies

    const accessToken = createJsonWebToken({ user }, jwtAccesskey, "30m");

    res.cookie("accessToken", accessToken, {
      maxAge: 35 * 60 * 1000, //35m
      httpOnly: true,
      //secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User was logged in successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User was logged Out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogout };
