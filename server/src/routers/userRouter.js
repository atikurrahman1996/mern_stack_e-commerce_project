const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
} = require("../controllers/userController");
const upload = require("../middleware/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggeOut, isAdmin } = require("../middleware/auth");
const userRouter = express.Router();

// GET:/api/users

userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggeOut,
  validateUserRegistration,
  runValidation,
  processRegister
);

userRouter.post("/activate", isLoggeOut, activateUserAccount);

userRouter.get("/", isLoggedIn, isAdmin, getUsers);

userRouter.get("/:id", isLoggedIn, getUserById);

userRouter.delete("/:id", isLoggedIn, deleteUserById);

userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);

userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById);

userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnbanUserById);

module.exports = userRouter;
