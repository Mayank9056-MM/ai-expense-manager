import express from "express"
import { verifyAuth } from "../middleware/verifyAuth.js"
import { upload } from "../middleware/multer.middleware.js"
import { getReceipt, uploadReceipt } from "../controllers/receipt.controllers.js"

const receiptRouter = express.Router()

receiptRouter.use(verifyAuth)

receiptRouter.route("/upload").post(upload.single("receipt"),uploadReceipt);
receiptRouter.route("/:id").get(getReceipt);

export default receiptRouter;