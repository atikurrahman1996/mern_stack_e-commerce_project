const express = require("express");

const upload = require("../middleware/uploadFile");
const runValidation = require("../validators");
const { isLoggedIn, isLoggeOut, isAdmin } = require("../middleware/auth");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const productRouter = express.Router();

// POST:/api/products

// create a product

productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct
);

// get all the products

productRouter.get("/", handleGetProducts);

// get single product

productRouter.get("/:slug", handleGetProduct);

module.exports = productRouter;
