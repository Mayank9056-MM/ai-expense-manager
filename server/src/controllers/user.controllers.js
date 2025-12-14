// coverImage not upload on cloudinary - Error

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// helper functions

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "user not found please register");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token and refresh token"
    );
  }
};

// main functions

const registerUser = asyncHandler(async (req, res) => {
  let avatar;

  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      email,
    });

    console.log(existedUser, "existed User");

    if (existedUser) {
      throw new ApiError(409, "User with email or name already exists");
    }

    const avatarLocalPath = req?.file?.path || null; // from multer the name avatar from route

    if (avatarLocalPath) {
      try {
        console.log("avatarLocalPath", avatarLocalPath);
        avatar = await uploadOnCloudinary(avatarLocalPath);

        console.log("Upload on cloudinary avatar", avatar);
      } catch (error) {
        console.log("Error uploading avatar", error);
        throw new ApiError(500, "Failed to upload avatar image");
      }
    }

    const user = await User.create({
      name: name.toLowerCase(),
      avatar: avatar?.secure_url || "",
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "something went wrong while creating user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("User creation failed", error);

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    throw new ApiError(
      500,
      "Something went wrong while registering user and images were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(402, "email required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(400, "user not found please register");
  }


  // validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(400, "Failed to log user");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {loggedInUser,accessToken}, "User logged in successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; // for mobile app

  if (!incomingRefreshToken) {
    throw new ApiError(401, "refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(403, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(
      401,
      "something went wrong while refreshing access token"
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user details"));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
};
