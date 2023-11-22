const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
	try {
		const rules = await db.rules.findAll();
		res.json({ error: false, list: rules });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: "Internal server error" });
	}
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const rule = await db.rules.findByPk(id);
		if (rule) {
			res.json(rule);
		} else {
			res.status(404).json({ error: `Rule ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const newRule = await db.rules.create({ ...req.body });
		res.status(201).json(newRule);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.put("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const rule = await db.rules.findByPk(id);
		if (rule) {
			await rule.update({ ...req.body });
			res.json({ message: `Rule ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `Rule ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const rule = await db.rules.findByPk(id);
		if (rule) {
			await rule.destroy();
			res.json({ message: `Rule ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Rule ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
