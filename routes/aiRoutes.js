import express from "express";

import {
    generateInterviewQuestions,
    evaluateInterview
} from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/generate-questions",
    authMiddleware,
    generateInterviewQuestions
);

router.post(
    "/evaluate-interview",
    authMiddleware,
    evaluateInterview
);

export default router;