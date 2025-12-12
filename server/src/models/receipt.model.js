import mongoose from "mongoose";
import { CATEGORIES } from "../constants.js";

const receiptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileUrl: {
      type: String,
      required: true, // Cloudinary URL or local path
    },

    extractedText: {
      type: String,
      required: false,
    },

    items: [
      {
        name: { type: String, required: false },
        price: { type: Number, required: false },
        quantity: { type: Number, default: 1 },
      },
    ],

    totalAmount: {
      type: Number,
      required: false,
      min: 1,
    },

    merchantName: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: false,
    },

    categorySuggestion: {
      type: String,
      enum: CATEGORIES,
      default: "other",
    },

    rawResponse: Object, // full Cline/OpenAI output

    isProcessed: {
      type: Boolean,
      default: false,
    },
    extractedText: {
      type: String,
      select: false,
    },
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      required: false,
    },
  },
  { timestamps: true }
);

// Indexes
receiptSchema.index({ user: 1, date: -1 });

const Receipt = mongoose.model("Receipt", receiptSchema);

export default Receipt;
