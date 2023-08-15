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

    req.body.userId = decoded._id;

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

module.exports = { isLoggedIn, isLoggeOut };
