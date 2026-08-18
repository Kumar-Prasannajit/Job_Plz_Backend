import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { authorize } from "../../../middlewares/role.middleware.js";
import { upload } from "../../../middlewares/upload.middleware.js";
import {
  getResumeById,
  updateResume,
  uploadResume,
  finalizeResume,
} from "../controllers/resume.controller.js";

const router = Router();

router.post(
  "/upload",
  authenticate,
  authorize("USER"),
  upload.single("resume"),
  uploadResume,
);

router.put("/:resumeId", authenticate, authorize("USER"), updateResume);

router.get("/:resumeId", authenticate, authorize("USER"), getResumeById);

router.post(
  "/:resumeId/finalize",
  authenticate,
  authorize("USER"),
  finalizeResume,
);

export default router;
