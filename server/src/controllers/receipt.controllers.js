import mongoose from "mongoose";
import Receipt from "../models/receipt.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Expense from "../models/expense.model.js";
import { extractTextFromImage } from "../services/ocr.service.js";
import { extractStructuredFromText } from "../services/openai.service.js";

const uploadReceipt = asyncHandler(async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    throw new ApiError(400, "Receipt is required");
  }

  const extractedText = await extractTextFromImage(filePath);

  if (!extractedText.trim()) {
    throw new ApiError(400, "Failed to extract text from receipt");
  }

  const parsed = await extractStructuredFromText(extractedText, {
    merchant: "",
    totalAmount: 0,
    date: "",
    items: [],
    category: "",
  });

  let uploaded = null;

  // upload on cloudinary
  try {
    uploaded = await uploadOnCloudinary(filePath);

    if (!uploaded?.url) {
      throw new ApiError(500, "Something went wrong while uploading receipt");
    }
  } catch (error) {
    console.log("Cloudinary upload failed:", error);
    throw new ApiError(500, "Failed to upload receipt to Cloudinary");
  }

  // Build Receipt Entry
  const receipt = await Receipt.create({
    user: req.user._id,
    fileUrl: uploaded.url,
    extractedText,
    totalAmount: parsed.totalAmount || 0,
    merchantName: parsed.merchant || "",
    date: parsed.date ? new Date(parsed.date) : new Date(),
    categorySuggestion: parsed.category || "other",
    rawResponse: parsed,
    isProcessed: true,
  });

  if (!receipt) {
    throw new ApiError(500, "Something went wrong while processing receipt");
  }

  const expense = await Expense.create({
    user: req.user._id,
    title: parsed.merchant || "Receipt Expense",
    amount: parsed.totalAmount || 0,
    category: parsed.category || "other",
    date: receipt.date,
    source: "receipt",
    meta: parsed,
  });

  if (!expense) {
    throw new ApiError(500, "Something went wrong while processing receipt");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, receipt, "Receipt processed successfully"));
});

export const getReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid receipt id");
  }

  const receipt = await Receipt.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!receipt) {
    throw new ApiError(404, "Receipt not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, receipt, "Receipt fetched successfully"));
});

export { uploadReceipt };
