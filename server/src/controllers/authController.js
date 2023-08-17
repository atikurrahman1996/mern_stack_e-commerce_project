const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtAccesskey, jwtRefreshkey } = require("../secret");

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

    //access token, cookies

    const accessToken = createJsonWebToken({ user }, jwtAccesskey, "1m");

    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000, //35m
      httpOnly: true,
      //secure: true,
      sameSite: "none",
    });

    //refresh token, cookies

    const refreshToken = createJsonWebToken({ user }, jwtRefreshkey, "7d");

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7d
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
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User was logged Out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    //verify the old refresh token

    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshkey);

    if (!decodedToken) {
      throw createError(
        401,
        "Invalid refresh access token. please login again"
      );
    }

    //access token, cookies

    const accessToken = createJsonWebToken(
      decodedToken.user,
      jwtAccesskey,
      "1m"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000, //1m
      httpOnly: true,
      //secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    //verify

    const decodedToken = jwt.verify(accessToken, jwtAccesskey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token. please login again");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "protected resources access successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
