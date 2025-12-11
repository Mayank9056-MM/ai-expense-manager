import express from "express";
import { verifyAuth } from "../middleware/verifyAuth";
import {
  addExpense,
  categoryBreakdown,
  deleteExpense,
  getExpenses,
  getMonthlySummmary,
  updateExpense,
} from "../controllers/expense.controllers";

const expenseRouter = express.Router();

expenseRouter.use(verifyAuth);

expenseRouter.route("/add").post(addExpense);
expenseRouter.route("/:id").patch(updateExpense).delete(deleteExpense);
expenseRouter.route("/all").get(getExpenses);
expenseRouter.route("/monthly-summary").get(getMonthlySummmary);
expenseRouter.route("/category-breakdown").get(categoryBreakdown);

export default expenseRouter;
