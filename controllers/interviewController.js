import Interview from "../models/Interview.js";

export const saveInterview = async (req, res) => {

    try {

        const {
            role,
            difficulty,
            type,
            questions,
            evaluation,
            timeTaken
        } = req.body;

        const interview = await Interview.create({

            user:req.user.id,

            role,
            difficulty,
            type,

            questions: questions.map((item, index) => ({
                question: item.question,
                answer: item.answer,
                score: evaluation.questionEvaluations[index]?.score || 0,
                feedback: evaluation.questionEvaluations[index]?.feedback || ""
            })),

            overallScore: evaluation.overallScore,

            technicalSkills: evaluation.technicalSkills,

            communication: evaluation.communication,

            confidence: evaluation.confidence,

            performanceLevel: evaluation.performanceLevel,

            improvements: evaluation.improvements,

            summary: evaluation.summary,

            timeTaken

        });

        res.status(201).json({
            success: true,
            message: "Interview saved successfully",
            interview
        });

    } catch (error) {

        console.error("Save Interview Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save interview",
            error: error.message
        });

    }

};
export const getInterviews = async (req, res) => {
    try {

        const interviews = await Interview.find({
            user:req.user.id
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            interviews
        });

    } catch (error) {

        console.error("Fetch Interviews Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch interviews"
        });
    }
};


export const getInterviewById = async (req, res) => {

    try {

        const { id } = req.params;

        const interview = await Interview.findOne({
            _id:id,
            user:req.user.id
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {

        console.error("Fetch Interview Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch interview"
        });
    }
};