const { body } = require("express-validator");

//catagory validation

const validateCatagory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Catagory Name is required.")
    .isLength({ min: 3 })
    .withMessage("Catagory name should be at least 3 characters long"),
];

module.exports = { validateCatagory };
