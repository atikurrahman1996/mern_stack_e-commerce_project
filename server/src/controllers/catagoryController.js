const slugify = require("slugify");
const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Catagory = require("../models/catagoryModel");
const {
  createCatagory,
  getCatagories,
  getCatagory,
  updateCatagory,
  deleteCatagory,
} = require("../services/catagoryService");

//create

const handleCreateCatagory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCatagory = await createCatagory(name);

    return successResponse(res, {
      statusCode: 201,
      message: "Catagory was created successfully",
      payload: newCatagory,
    });
  } catch (error) {
    next(error);
  }
};

// Read

const handleGetCatagories = async (req, res, next) => {
  try {
    const catagories = await getCatagories();

    return successResponse(res, {
      statusCode: 200,
      message: "Catagory was return successfully",
      payload: catagories,
    });
  } catch (error) {
    next(error);
  }
};

// Read single catagory

const handleGetCatagory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const catagory = await getCatagory(slug);

    if (!catagory) {
      throw createError(404, "Catagory not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Catagory was return successfully",
      payload: catagory,
    });
  } catch (error) {
    next(error);
  }
};

// Update catagory

const handleUpdateCatagory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;

    const updatedCatagory = await updateCatagory(name, slug);

    if (!updatedCatagory) {
      throw createError(404, "No Catagory was found with this slug");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Catagory was updated successfully",
      payload: updatedCatagory,
    });
  } catch (error) {
    next(error);
  }
};

// Delete catagory

const handleDeleteCatagory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await deleteCatagory(slug);

    if (!result) {
      throw createError(404, "No Catagory was found to delete");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Catagory was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCatagory,
  handleGetCatagories,
  handleGetCatagory,
  handleUpdateCatagory,
  handleDeleteCatagory,
};
