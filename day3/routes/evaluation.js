const express = require("express");
const router = express.Router();
const db = require("../models");
const { decodeBase64 } = require("../services/decodeService");

router.get("/", async (req, res) => {
	try {
		const { variable: encodedVariable } = req.query;

		const encodedString = btoa(encodedVariable);
		console.log(encodedString);
		const decodedVariable = decodeBase64(encodedString);

		const rules = await db.rules.findAll();

		const evaluationResults = [];

		for (const rule of rules) {
			const substitutedCondition = substituteVariables(
				rule.condition,
				decodedVariable
			);

			const conditionResult = evaluateCondition(substitutedCondition);

			if (conditionResult) {
				evaluationResults.push({
					rule_id: rule.id,
					result: rule.action,
				});
			}
		}

		res.json(evaluationResults);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal server error",
			message: error.message,
			decoded: decodeBase64(req.query.variable),
		});
	}
});

function substituteVariables(condition, variables) {
	for (const variableName in variables) {
		const variableValue = variables[variableName];
		condition = condition.replace(
			new RegExp(`\\$\\{${variableName}\\}`, "g"),
			variableValue
		);
	}
	return condition;
}

function evaluateCondition(condition) {
	return eval(condition);
}

module.exports = router;
