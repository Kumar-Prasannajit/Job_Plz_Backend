import { Router } from "express";

import { jobController } from "../controllers/job.controller.js";

const router = Router();

router.get(
  "/:jobId",
  jobController.getById,
);

export default router;