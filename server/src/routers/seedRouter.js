const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seedController");
const upload = require("../middleware/uploadFile");
const seedRouter = express.Router();

seedRouter.get("/users", seedUser); // upload.single("image") used inside seed router if you workd with image

seedRouter.get("/products", seedProducts); // upload.single("image") used inside seed router if you workd with image

module.exports = seedRouter;
