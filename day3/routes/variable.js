const express = require("express");
const router = express.Router();
const db = require("../models");

// Variables Routes
router.get("/", async (req, res) => {
	try {
		const variables = await db.variables.findAll();
		res.json({ error: false, list: variables });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: "Internal server error" });
	}
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const variable = await db.variables.findByPk(id);
		if (variable) {
			res.json(variable);
		} else {
			res.status(404).json({ error: `Variable ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const newVariable = await db.variables.create({ ...req.body });
		res.status(201).json(newVariable);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.put("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const variable = await db.variables.findByPk(id);
		if (variable) {
			await variable.update({ ...req.body });
			res.json({ message: `Variable ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `Variable ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const variable = await db.variables.findByPk(id);
		if (variable) {
			await variable.destroy();
			res.json({ message: `Variable ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Variable ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
