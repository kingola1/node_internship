// emailRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models");

// GET all emails
router.get("/", async (req, res) => {
	try {
		const emails = await db.email.findAll();
		res.json(emails);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

// GET one email by ID
router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const email = await db.email.findByPk(id);
		if (email) {
			res.json(email);
		} else {
			res.status(404).json({ error: `Email ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// POST add a new email
router.post("/", async (req, res) => {
	try {
		const newEmail = await db.email.create({ ...req.body });
		res.status(201).json(newEmail);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// PUT update an email by ID
router.put("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const email = await db.email.findByPk(id);
		if (email) {
			await email.update({ ...req.body });
			res.json({ message: `Email ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `Email ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// DELETE an email by ID
router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const email = await db.email.findByPk(id);
		if (email) {
			await email.destroy();
			res.json({ message: `Email ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Email ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
