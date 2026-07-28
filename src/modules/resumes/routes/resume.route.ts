import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { upload } from "../../../middlewares/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";

const router = Router();

router.post(
    "/upload",
    authenticate,
    upload.single("resume"),
    uploadResume
);

export default router;