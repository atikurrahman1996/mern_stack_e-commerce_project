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

const getProducts = async (page = 1, limit = 5, filter = {}) => {
  const products = await Product.find(filter)
    .populate("catagory")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products) throw createError(404, "no product was found");

  const count = await Product.find(filter).countDocuments();

  return { products, count };
};

const getProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("catagory");

  if (!product) throw createError(404, "no product was found");

  return product;
};
const deleteProduct = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });

  if (!product) throw createError(404, "no product was found");

  return product;
};
const updateProduct = async (slug, updates, updateOptions) => {
  if (updates.name) {
    updates.slug = slugify(updates.name);
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    updates,
    updateOptions
  );

  if (!updatedProduct) {
    throw createError(404, "product with this slug does not exist");
  }

  return updatedProduct;
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
