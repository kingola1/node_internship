// userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models");

// GET all users
router.get("/", async (req, res) => {
	try {
		const users = await db.user.findAll();
		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

// GET one user by ID
router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await db.user.findByPk(id);
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ error: `User ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// POST add a new user
router.post("/", async (req, res) => {
	try {
		const newUser = await db.user.create({ ...req.body });
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// PUT update a user by ID
router.put("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await db.user.findByPk(id);
		if (user) {
			await user.update({ ...req.body });
			res.json({ message: `User ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `User ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// DELETE a user by ID
router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await db.user.findByPk(id);
		if (user) {
			await user.destroy();
			res.json({ message: `User ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `User ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
