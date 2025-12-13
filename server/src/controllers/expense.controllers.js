import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { CATEGORIES } from "../constants.js";

// helper functions
const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

// main functions

const addExpense = asyncHandler(async (req,res) => {
  const { title, amount, category, date, notes } = req.body;

  // validations
  if (!title || !amount || !category || !date) {
    throw new ApiError(400, "All fields are required");
  }

  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }

  if (category && !CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category selected");
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    throw new ApiError(400, "Amount must be a positive number");
  }

  const parsedDate = date ? new Date(date) : new Date();

  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const expense = await Expense.create({
    user: req.user._id,
    title: title.trim(),
    amount: Number(amount),
    category,
    date: parsedDate,
    notes,
    source: "manual",
  });

  if (!expense._id) {
    throw new ApiError(500, "Something went wrong while adding expense");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense added successfully"));
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid expense id");
  }

  const { title, amount, category, date, notes } = req.body;

  // validations

  if (category && !CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category selected");
  }

  if (amount) {
    if (isNaN(amount) || Number(amount) <= 0) {
      throw new ApiError(400, "Amount must be a positive number");
    }
  }

  let parsedDate = null;

  if (date) {
    parsedDate = date ? new Date(date) : new Date();

    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid date format");
    }
  }

  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(400, "Expense not found");
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    { _id: id, user: req.user._id },
    {
      $set: {
        title: title?.trim() || expense.title,
        amount: Number(amount) || expense.amount,
        category: category || expense.category,
        date: parsedDate || expense.date,
        notes: notes || expense.notes,
      },
    },
    { new: true }
  );

  if (!updatedExpense) {
    throw new ApiError(500, "Something went wrong while updating expense");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedExpense, "Expense updated successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid expense id");
  }

  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(400, "Expense not found");
  }

  // soft delete
  const deletedExpense = await Expense.findByIdAndUpdate(
    { _id: id, user: req.user._id },
    { isDeleted: true },
    { new: true }
  );

  if (!deletedExpense) {
    throw new ApiError(500, "Something went wrong while deleting expense");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedExpense, "Expense deleted successfully"));
});

const getExpenses = asyncHandler(async (req, res) => {
  const { category, sortBy, startDate, endDate } = req.query;

  if (category && !CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category selected");
  }

  const filter = {
    user: req.user._id,
    isDeleted: false,
  };

  if (category) {
    filter.category = category;
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isValidDate(start) || !isValidDate(end)) {
      throw new ApiError(400, "Invalid startDate or endDate format");
    }

    filter.date = { $gte: start, $lte: end };
  }

  const sortOptions = {};

  if (sortBy == "amount") {
    sortOptions.amount = -1;
  } else {
    sortOptions.date = -1;
  }

  const expenses = await Expense.find(filter).sort(sortOptions);

  if (!expenses) {
    throw new ApiError(500, "Something went wrong while fetching expenses");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
});

const getMonthlySummmary = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  console.log("monthStart", monthStart, "monthEnd", monthEnd);

  const summary = await Expense.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
        date: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
        avgSpent: { $avg: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!summary) {
    throw new ApiError(500, "Something went wrong while fetching summary");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, summary, "Monthly summary fetched successfully")
    );
});

const categoryBreakdown = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const breakdown = await Expense.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  if (!breakdown) {
    throw new ApiError(500, "Something went wrong while fetching summary");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, breakdown, "Category breakdown fetched successfully")
    );
});

export {
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  getMonthlySummmary,
  categoryBreakdown,
};
