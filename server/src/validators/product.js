const { body } = require("express-validator");

//catagory validation

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required.")
    .isLength({ min: 3 })
    .withMessage("Catagory name should be at least 3 characters long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 3 })
    .withMessage("Catagory name should be at least 3 characters long"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price Name is required.")
    .isFloat({ min: 0 })
    .withMessage("price muct be positive"),
];

module.exports = { validateProduct };
