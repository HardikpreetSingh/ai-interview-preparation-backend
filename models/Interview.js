import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        },

        questions: [
            {
                question: String,
                answer: String,
                score: Number,
                feedback: String
            }
        ],

        overallScore: {
            type: Number,
            required: true
        },

        technicalSkills: Number,

        communication: Number,

        confidence: Number,

        performanceLevel: String,

        improvements: [String],

        summary: String,

        timeTaken: Number
    },

    {
        timestamps: true
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;