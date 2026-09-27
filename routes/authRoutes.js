import express from "express";
import { signup , login , getMe, updateProfile, changePassword, deleteAccount} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me",authMiddleware,getMe);
router.put("/profile",authMiddleware,updateProfile);
router.put("/change-password",authMiddleware,changePassword);
router.delete("/account",authMiddleware,deleteAccount);

export default router;