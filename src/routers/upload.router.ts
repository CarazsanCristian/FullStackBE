import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import UploadController from "../controllers/upload.controller";
import multer from "multer";

const uploadRouter = express.Router();

const upload = multer({ dest: "uploads/" });

uploadRouter.use(authMiddleware);

uploadRouter.post("/", upload.single("file"), UploadController.createItem);

export default uploadRouter;
