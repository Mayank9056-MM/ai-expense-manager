import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Expense from "../models/expense.models.js";
import { askOpenAI, summarizeExpenses } from "../services/openai.service.js";

export const chatWithAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    throw new ApiError(400, "Prompt is required");
  }

  const expenses = await Expense.find({
    user: req.user._id,
    isDeleted: false,
  });

  if (!expenses) {
    throw new ApiError(500, "Something went wrong while fetching expenses");
  }

  const messages = [
    { role: "system", content: "You are a helpful finance assistant." },
    {
      role: "user",
      content: `User prompt: ${prompt}\nContext: ${JSON.stringify(expenses.slice(-50))}`,
    },
  ];

  const aiResponse = await askOpenAI(messages, { useCache: false });

  if (!aiResponse) {
    throw new ApiError(
      500,
      "Something went wrong while generating AI response"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, aiResponse, "AI response generated"));
});
