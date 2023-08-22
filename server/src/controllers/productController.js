const createError = require("http-errors");
const slugify = require("slugify");

const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const Product = require("../models/productModel");
const {
  createProduct,
  getProducts,
  getProduct,
} = require("../services/productService");

// create new Product

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

const handleGetProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; //assume 1st page
    const limit = parseInt(req.query.limit) || 5;

    const productsData = await getProducts(page, limit);

    return successResponse(res, {
      statusCode: 200,
      message: "All the product was returned succssfully",
      payload: {
        products: productsData.products,
        pagination: {
          totalPages: Math.ceil(productsData.count / limit),
          currentPage: page,
          previousPage: page - 1,
          nextPage: page + 1,
          totalNumberOfProducts: productsData.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getProduct(slug);

    return successResponse(res, {
      statusCode: 200,
      message: "Single product was returned succssfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateProduct, handleGetProducts, handleGetProduct };
