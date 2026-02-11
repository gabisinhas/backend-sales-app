import { Router } from "express";
import { uploadMiddleware } from "./middlewares/uploadMiddleware.js";
import { UploadController } from "./controllers/UploadController.js";

const routes = Router();
const uploadController = new UploadController();

routes.post(
  "/upload",
  uploadMiddleware.single("file"),
  (req, res) => uploadController.upload(req, res)
);

export default routes;
