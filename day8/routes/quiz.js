// routes/quiz.js
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
	try {
		// Get all Quizzes
		const quizzes = await db.quiz.findAll();

		// Format the response
		const formattedQuizzes = [];

		for (const quiz of quizzes) {
			const formattedQuiz = {
				id: quiz.id,
				type: quiz.type,
				question: quiz.question,
				answers: [],
				correct_answer: null, // Initialize correct_answer to null
			};

			// Fetch answers for the current quiz
			const quizAnswers = await db.answer.findAll({
				where: { question_id: quiz.id },
				attributes: ["id", "answer"],
			});

			formattedQuiz.answers = quizAnswers.map((answer) => ({
				id: answer.id,
				answer: answer.answer,
			}));

			// Fetch correct answer for the current quiz
			const correctAnswer = await db.correct_answer.findOne({
				where: { question_id: quiz.id },
				attributes: ["answer_id"],
			});

			// Check if correctAnswer exists before accessing properties
			if (correctAnswer) {
				formattedQuiz.correct_answer = formattedQuiz.answers.findIndex(
					(answer) => answer.id === correctAnswer.answer_id
				);
			}

			formattedQuizzes.push(formattedQuiz);
		}

		res.json({
			errors: "false",
			list: formattedQuizzes,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "true", message: error.message });
	}
});

module.exports = router;
