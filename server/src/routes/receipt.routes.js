import express from "express"
import { verifyAuth } from "../middleware/verifyAuth"
import { upload } from "../middleware/multer.middleware"
import { getReceipt, uploadRecipt } from "../controllers/receipt.controllers"

const receiptRouter = express.Router()

receiptRouter.use(verifyAuth)

receiptRouter.route("/upload").post(upload.single("receipt"),uploadRecipt);
receiptRouter.route("/:id").get(getReceipt);

export default receiptRouter;