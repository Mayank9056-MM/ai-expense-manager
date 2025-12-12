import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { getInsights } from "../controllers/insights.controllers.js";

const insightRouter = express.Router();

insightRouter.use(verifyAuth);

insightRouter.route("/").get(getInsights);

export default insightRouter;
