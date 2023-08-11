const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationkey, clientURL } = require("../secret");
const emailWithNodeMailer = require("../helper/email");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || ""; //empty string
    const page = Number(req.query.page) || 1; //assume 1st page
    const limit = Number(req.query.limit) || 5; //assume 5 users

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

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User is returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;
    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User were deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// new user registration

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exist, please sign in"
      );
    }

    // create JWT token

    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationkey,
      "20m"
    );

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: ` 
      <h2> Hello ${name} </h2>
      <p> please click here to <a href = "${clientURL}/api/users/activate/${token}" target="_blank"> Activate your account </a></p>
      `,
    };

    // send email with nodemailer

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to complete your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// Verify and activate account

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationkey);
      if (!decoded) throw createError(404, " user was not able to verify");

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(
          409,
          "User with this email already exist, please sign in"
        );
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "user was register successfully",
      });
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        throw createError(401, "Token has Expired");
      } else if (error.name == "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
