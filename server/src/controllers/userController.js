const createError = require("http-errors");

const getUser = (req, res, next) => {
  try {
    res.status(200).send({
      message: "Users is returned",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;