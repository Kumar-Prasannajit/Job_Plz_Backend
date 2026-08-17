import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { upload } from "../../../middlewares/upload.middleware.js";
import {
  getResumeById,
  updateResume,
  uploadResume,
  finalizeResume,
} from "../controllers/resume.controller.js";

const router = Router();

router.post("/upload", authenticate, upload.single("resume"), uploadResume);

router.put("/:resumeId", authenticate, updateResume);

router.get("/:resumeId", authenticate, getResumeById);

router.post("/:resumeId/finalize", authenticate, finalizeResume);

export default router;
