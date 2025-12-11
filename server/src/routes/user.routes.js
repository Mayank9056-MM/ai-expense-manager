import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers";
import { upload } from "../middleware/multer.middleware";
import { verifyAuth } from "../middleware/verifyAuth";

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyAuth, logoutUser);
userRouter.route("/").get(verifyAuth, getCurrentUser).post(refreshAccessToken);

export default userRouter;
