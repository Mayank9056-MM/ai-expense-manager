import express from "express"
import { verifyAuth } from "../middleware/verifyAuth.js"
import { chatWithAI } from "../controllers/chat.controllers.js";

const chatRouter = express.Router()

chatRouter.use(verifyAuth);

chatRouter.route("/").post(chatWithAI);

export default chatRouter;