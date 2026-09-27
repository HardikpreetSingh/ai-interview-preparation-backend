import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/interviews", interviewRoutes);


app.get("/", (req, res) => {
    res.send("🚀 AI Interview Prep Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// app.use(cors({
//     origin:"http://localhost:5173"
// }));