const createError = require("http-errors");
const slugify = require("slugify");

const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const Product = require("../models/productModel");
const { createProduct } = require("../services/productService");

// new user registration

const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, image, catagory } =
      req.body;

    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      image,
      catagory,
    };

    const product = await createProduct(productData);

    return successResponse(res, {
      statusCode: 200,
      message: "product was created succssfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateProduct };
