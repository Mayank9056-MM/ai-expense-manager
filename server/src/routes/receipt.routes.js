import express from "express"
import { verifyAuth } from "../middleware/verifyAuth.js"
import { upload } from "../middleware/multer.middleware.js"
import { getReceipt, uploadRecipt } from "../controllers/receipt.controllers.js"

const receiptRouter = express.Router()

receiptRouter.use(verifyAuth)

receiptRouter.route("/upload").post(upload.single("receipt"),uploadRecipt);
receiptRouter.route("/:id").get(getReceipt);

export default receiptRouter;