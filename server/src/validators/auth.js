const { body } = require("express-validator");

//Registration validation

const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your full name")
    .isLength({ min: 3, max: 31 })
    .withMessage("name should be 3 to 31 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your valid Email")
    .isEmail()
    .withMessage("Invalid Email Address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password should be atleast 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should be combination of one uppercase , one lower case, one number, one special char"
    ),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("addres is required")
    .isLength({ min: 5 })
    .withMessage("The minimum leanght of address is is 5 characters"),

  body("phone").trim().notEmpty().withMessage("phone number is required"),
  /*
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("User image is required"),
    */
];

//Sign In validation
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your valid Email")
    .isEmail()
    .withMessage("Invalid Email Address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password should be atleast 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should be combination of one uppercase , one lower case, one number, one special char"
    ),
];

module.exports = { validateUserRegistration, validateUserLogin };
