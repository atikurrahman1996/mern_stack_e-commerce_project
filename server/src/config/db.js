const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
//const logger = require("../controllers/loggerController");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("Mongodb is successfully connected");

    //logger.log("info", "Mongodb is successfully connected"); // if we use logger method to see result in console log

    mongoose.connection.on("error", (error) => {
      console.error("DB connection error: ", error);
    });
  } catch (error) {
    console.error("could not connect to DB: ", error.toString());

    //logger.log("error", "could not connect to DB: ", error.toString());
  }
};

module.exports = connectDB;
