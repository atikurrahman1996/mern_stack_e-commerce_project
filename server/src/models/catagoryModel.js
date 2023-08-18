const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const catagorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Catagory name is required"],
      trim: true,
      unique: true,
      minLength: [3, "The minimum leanght of catagory name is 3 characters"],
    },

    slug: {
      type: String,
      required: [true, "Catagory slug is required"],
      lowercase: true,
      unique: true,
    },
  },

  { timestamps: true }
);

// if user created he is not be a admin by defalut, he is not banned by deafult
// timestamps will return two value , created at and updated at

//Create model

const Catagory = model("Catagory", catagorySchema);

module.exports = Catagory;
