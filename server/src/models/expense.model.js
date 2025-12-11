import mongoose from "mongoose";
import { CATEGORIES } from "../constants";

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least 1"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "other",
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    source: {
      type: String,
      enum: ["manual", "receipt"],
      default: "manual",
    },

    notes: {
      type: String,
      maxlength: 300,
    },

    // Extra metadata from receipts or AI
    meta: {
      type: Object,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for faster analytics
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ amount: -1 });

export default mongoose.model("Expense", ExpenseSchema);
