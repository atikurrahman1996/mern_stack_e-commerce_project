const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccesskey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw createError(401, "Access Token not found. please log In");
    }

    const decoded = jwt.verify(token, jwtAccesskey);
    console.log(decoded);

    if (!decoded) {
      throw createError(401, "Invalid Access Token");
    }

    req.user = decoded.user;

    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggeOut = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (token) {
      throw createError(400, "User is already logged In");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    console.log(req.user.isAdmin);
    if (!req.user.isAdmin) {
      throw createError(403, "Forbidden! You are not an admin.");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggeOut, isAdmin };
