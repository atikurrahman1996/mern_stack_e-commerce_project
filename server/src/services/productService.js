const createError = require("http-errors");
const slugify = require("slugify");
const Product = require("../models/productModel");

const createProduct = async (productData) => {
  const { name, description, price, quantity, shipping, image, catagory } =
    productData;

  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createError(409, "Product with this name is already exist");
  }

  // create product

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

module.exports = { createProduct };
