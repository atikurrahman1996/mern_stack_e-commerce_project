const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");

const getUser = async (req, res, next) => {
  try {
    const search = req.query.search || ""; //empty string
    const page = Number(req.query.page) || 1; //assume 1st page
    const limit = Number(req.query.limit) || 1; //assume 1 users

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();
    if (!users) throw createError(404, "user not found");

    return successResponse(res, {
      statusCode: 200,
      message: "Users is returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
