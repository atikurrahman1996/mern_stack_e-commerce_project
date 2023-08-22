const express = require("express");

const upload = require("../middleware/uploadFile");
const runValidation = require("../validators");
const { isLoggedIn, isLoggeOut, isAdmin } = require("../middleware/auth");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
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

// get single product with slug

productRouter.get("/:slug", handleGetProduct);

// delete single product with slug

productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);

// update single product with slug

productRouter.put(
  "/:slug",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

module.exports = productRouter;
