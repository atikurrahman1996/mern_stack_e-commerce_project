require("dotenv").config();
const PORT = process.env.SERVER_PORT || 3001;

const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/Picture2.jpg";

const jwtActivationkey = process.env.JWT_ACTIVATION_KEY || "abcdefghaaaaaaaaag";

const smtpUsername = process.env.SMTP_USERNAME || "";

const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL || "";

module.exports = {
  PORT,
  mongodbURL,
  defaultImagePath,
  jwtActivationkey,
  smtpUsername,
  smtpPassword,
  clientURL,
};
