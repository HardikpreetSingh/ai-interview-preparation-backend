import express from "express";
import {
    saveInterview,
    getInterviews,
    getInterviewById
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, saveInterview);
router.get("/", authMiddleware, getInterviews);
router.get("/:id", authMiddleware, getInterviewById);

export default router;