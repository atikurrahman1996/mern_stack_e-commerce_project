const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: [5, "The minimum leanght of user name is 5 characters"],
      maxLength: [31, "The maximum leanght of user name is 31 characters"],
    },
    email: {
      type: String,
      required: [true, "Email required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: [6, "The minimum leanght of user name is 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    image: {
      type: String,
      default: defaultImagePath,
    },

    address: {
      type: String,
      required: [true, "User address is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "User phone number is required"],
      trim: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// if user created he is not be a admin by defalut, he is not banned by deafult
// timestamps will return two value , created at and updated at

//Create model

const User = model("Users", userSchema);

module.exports = User;
