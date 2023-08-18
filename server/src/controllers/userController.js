const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationkey,
  clientURL,
  jwtResetPasswordkey,
} = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const checkUserExists = require("../helper/checkUserExists");
const sendEmail = require("../helper/sendEmail");

// find/read user

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

// delete user

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    await findWithId(User, id, options);

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

    /*
    const image = req.file;

    if (!image) {
      throw createError(400, "Image file is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(
        400,
        "Image file is too large. It must be less than 2MB"
      );
    }

    const imageBufferString = image.buffer.toString("base64");

    */

    const userExists = await checkUserExists(email);
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
      "30m"
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

    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to complete your registration process`,
      payload: token,
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

// update user

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const options = { password: 0 };
    await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    //name,password, address, email, phone, image

    for (const key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (key == "email") {
        throw createError(400, "Email can not be updated");
      }
    }

    /*

    const image = req.file;

    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "Image file is too large. It must be less than 2MB"
        );
      }
      updates.image = image.buffer.toString("base64");
    }
    */

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    );

    if (!updatedUser) {
      throw createError(404, "User with this ID does not exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was update successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// handle banned user

const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: true };

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    );

    if (!updatedUser) {
      throw createError(400, "User was not banned successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was banned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// handle unbanned user

const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: false };

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    );

    if (!updatedUser) {
      throw createError(400, "User was not un banned successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was un banned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// handle user Update Password

const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    //compare password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "old password is not correct");
    }

    //const filter = { userId };
    //const updates = { $set: { password: newPassword } };
    //const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      throw createError(400, "User was not updated successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User Password was Update successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
// handle user Forget Password

const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(
        404,
        "Your email is incorrect or you have not varified your email address"
      );
    }

    // create JWT token

    const token = createJsonWebToken({ email }, jwtResetPasswordkey, "30m");

    // prepare email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: ` 
  <h2> Hello ${userData.name} </h2>
  <p> please click here to <a href = "${clientURL}/api/users/reset-password/${token}" target="_blank"> Reset your password  </a></p>
  `,
    };

    // send email with nodemailer

    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to reset your password`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

// handle user Reset Password

const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jwtResetPasswordkey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const updates = { $set: { password: password } };
    const updateOptions = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      updates,
      updateOptions
    );

    if (!updatedUser) {
      throw createError(
        400,
        "User reset password was not updated successfully"
      );
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User Reset Password was successfully",
      payload: {},
    });
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
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
