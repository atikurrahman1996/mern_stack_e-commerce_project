const createError = require("http-errors");
const slugify = require("slugify");

const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const Product = require("../models/productModel");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
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

// get Products
const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || ""; //empty string
    const page = parseInt(req.query.page) || 1; //assume 1st page
    const limit = parseInt(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        //{ email: { $regex: searchRegExp } },
      ],
    };

    const productsData = await getProducts(page, limit, filter);

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
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await deleteProduct(slug);

    return successResponse(res, {
      statusCode: 200,
      message: "Single product was deleted succssfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    const allowedFields = [
      "name",
      "description",
      "price",
      "sold",
      "quantity",
      "shipping",
    ];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedProduct = await updateProduct(slug, updates, updateOptions);

    return successResponse(res, {
      statusCode: 200,
      message: "Product was updated successfully",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
