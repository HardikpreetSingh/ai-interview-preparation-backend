import { GoogleGenAI } from "@google/genai";
import Interview from "../models/Interview.js";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateInterviewQuestions = async (req, res) => {

    try {

        const {
            role,
            difficulty,
            type,
            numberOfQuestions
        } = req.body;

        const userId = req.user.id;

        const count = numberOfQuestions || 5;
        const previousInterviews = await Interview.find({
            user: userId
        });

        const previousQuestions = previousInterviews.flatMap(
            interview =>
            interview.questions.map(q => q.question)
        )
        .slice(0,50);

const prompt = `
You are an expert AI interviewer.

Generate ${count} fresh interview questions for a ${role || "Software Developer"} position.

Difficulty: ${difficulty || "Medium"}
Interview Type: ${type || "Technical"}

IMPORTANT RULES:

1. Generate completely new questions.
2. DO NOT repeat any question from the previous questions list.
3. Avoid asking the same concept with only slightly different wording.
4. Vary the questions between:
   - conceptual knowledge
   - practical scenarios
   - problem solving
   - debugging
   - real-world situations
5. Match the requested role, difficulty and interview type.
6. Make the questions appropriate for an actual job interview.

Previously asked questions:

${previousQuestions.length > 0
    ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
    : "No previous questions. This is the user's first interview."}

Return ONLY a JSON array of strings.

Example:
[
    "Explain how React reconciliation works.",
    "How would you optimize a React application that renders thousands of items?",
    "A component is re-rendering unnecessarily. How would you debug it?"
]

Do not include markdown.
Do not include explanations.
Do not include anything outside the JSON array.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        console.log("Gemini response:");
        console.log(response.text);

        let text = response.text.trim();

        // Remove markdown code fences if Gemini happens to add them
        if (text.startsWith("```")) {
            text = text
                .replace(/^```json\s*/, "")
                .replace(/^```\s*/, "")
                .replace(/```$/, "")
                .trim();
        }

        const questions = JSON.parse(text);

        res.status(200).json({
            success: true,
            questions
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate interview questions",
            error: error.message
        });
    }
};
export const evaluateInterview = async (req, res) => {

    try {

        const {
            role,
            difficulty,
            type,
            questions,
            answers
        } = req.body;

        const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's interview performance.

Role: ${role}
Difficulty: ${difficulty}
Interview Type: ${type}

Questions and Candidate Answers:

${questions.map((question, index) => `
Question ${index + 1}: ${question}

Candidate Answer:
${answers[index]?.answer || "No answer provided"}
`).join("\n")}

Evaluate every answer.

For each question provide:
- score out of 10
- brief feedback

Then provide:
- overall score out of 100
- technical skills score out of 100
- communication score out of 100
- confidence score out of 100
- performance level
- 3 improvement suggestions
- overall performance summary

Return ONLY valid JSON.

Use exactly this structure:

{
    "overallScore": 0,
    "technicalSkills": 0,
    "communication": 0,
    "confidence": 0,
    "performanceLevel": "",
    "questionEvaluations": [
        {
            "question": "",
            "score": 0,
            "feedback": ""
        }
    ],
    "improvements": [
        "",
        "",
        ""
    ],
    "summary": ""
}

Do not include markdown.
Do not include anything outside the JSON.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        console.log("Gemini Evaluation:");
        console.log(response.text);

        let text = response.text.trim();

        if (text.startsWith("```")) {

            text = text
                .replace(/^```json\s*/, "")
                .replace(/^```\s*/, "")
                .replace(/```$/, "")
                .trim();

        }

        const evaluation = JSON.parse(text);

        res.status(200).json({
            success: true,
            evaluation
        });

    } catch (error) {

        console.error("Evaluation Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to evaluate interview",
            error: error.message
        });

    }
};