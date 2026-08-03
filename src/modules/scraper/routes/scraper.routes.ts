import { Router } from "express";

import { scraperController } from "../controllers/scraper.controller.js";

const router = Router();

router.get(
  "/providers",
  scraperController.listProviders,
);

router.post(
  "/:providerId/run",
  scraperController.runProvider,
);

export default router;