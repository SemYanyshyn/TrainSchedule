import { Router } from "express";

import {
  createTrain,
  deleteTrain,
  getTrains,
  updateTrain,
} from "../controllers/train.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getTrains);
router.post("/", authenticate, createTrain);
router.put("/:id", authenticate, updateTrain);
router.delete("/:id", authenticate, deleteTrain);

export default router;
