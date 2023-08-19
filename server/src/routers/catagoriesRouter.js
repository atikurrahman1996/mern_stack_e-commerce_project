const express = require("express");
const {
  handleCreateCatagory,
  handleGetCatagories,
  handleGetCatagory,
  handleUpdateCatagory,
  handleDeleteCatagory,
} = require("../controllers/catagoryController");
const { validateCatagory } = require("../validators/catagory");
const runValidation = require("../validators");
const { isLoggedIn, isLoggeOut, isAdmin } = require("../middleware/auth");

const catagoryRouter = express.Router();

// POST:/api/catagories

catagoryRouter.post(
  "/",
  validateCatagory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCatagory
);

// GET:/api/catagories

catagoryRouter.get("/", handleGetCatagories);

catagoryRouter.get("/:slug", handleGetCatagory);

catagoryRouter.put(
  "/:slug",
  validateCatagory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleUpdateCatagory
);
catagoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCatagory);

module.exports = catagoryRouter;
