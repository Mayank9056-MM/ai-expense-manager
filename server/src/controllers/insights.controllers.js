import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Expense from "../models/expense.model.js";

export const getInsights = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const insights = await Expense.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "#category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);

  if (!insights) {
    throw new ApiError(500, "Something went wrong while fetching insights");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, insights, "Insights fetched successfully"));
});
