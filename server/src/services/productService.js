const createError = require("http-errors");
const slugify = require("slugify");
const Product = require("../models/productModel");

// create product

const createProduct = async (productData) => {
  const { name, description, price, quantity, shipping, image, catagory } =
    productData;

  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createError(409, "Product with this name is already exist");
  }

  const product = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: image,
    catagory: catagory,
  });
  return product;
};

//Read all products

const getProducts = async (page = 1, limit = 5) => {
  const products = await Product.find({})
    .populate("catagory")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products) throw createError(404, "no product was found");

  const count = await Product.find({}).countDocuments();

  return { products, count };
};

const getProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("catagory");

  if (!product) throw createError(404, "no product was found");

  return product;
};

module.exports = { createProduct, getProducts, getProduct };
