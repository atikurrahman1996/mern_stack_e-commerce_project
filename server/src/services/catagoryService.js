const slugify = require("slugify");

const Catagory = require("../models/catagoryModel");

const createCatagory = async (name) => {
  const newCatagory = await Catagory.create({
    name: name,
    slug: slugify(name),
  });
  return newCatagory;
};

const getCatagories = async () => {
  return await Catagory.find({}).select("name slug").lean();
};
const getCatagory = async (slug) => {
  return await Catagory.find({ slug }).select("name slug").lean();
};

const updateCatagory = async (name, slug) => {
  const filter = { slug };
  const updates = { $set: { name: name, slug: slugify(name) } };
  const option = { new: true };

  const updateCatagory = await Catagory.findOneAndUpdate(
    filter,
    updates,
    option
  );
  return updateCatagory;
};

const deleteCatagory = async (slug) => {
  const result = await Catagory.findOneAndDelete({ slug });
  return result;
};

module.exports = {
  createCatagory,
  getCatagories,
  getCatagory,
  updateCatagory,
  deleteCatagory,
};
