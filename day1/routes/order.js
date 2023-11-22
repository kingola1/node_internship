var express = require("express");
var router = express.Router();
const db = require("../models");

/* GET ALL */
router.get("/", async function (req, res, next) {
	try {
		const orders = await db.order.findAll();
		res.json({ error: false, list: orders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

/* GET ONE */
router.get("/:id", async function (req, res, next) {
	const id = req.params.id;
	try {
		const order = await db.order.findByPk(id);
		if (order) {
			res.json(order);
		} else {
			res.status(404).json({ error: `Order ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* ADD ONE */
router.post("/", async function (req, res, next) {
	try {
		const newOrder = await db.order.create({ ...req.body });
		res.status(201).json(newOrder);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* UPDATE ONE */
router.put("/:id", async function (req, res, next) {
	const id = req.params.id;
	const { user_id, amount, tax, notes, status } = req.body;
	try {
		const order = await db.order.findByPk(id);
		if (order) {
			await order.update({
				user_id: user_id !== undefined ? user_id : order.user_id,
				amount: amount !== undefined ? amount : order.amount,
				tax: tax !== undefined ? tax : order.tax,
				notes: notes !== undefined ? notes : order.notes,
				status: status !== undefined ? status : order.status,
			});
			res.json({ message: `Order ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `Order ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* DELETE ONE */
router.delete("/:id", async function (req, res, next) {
	const id = req.params.id;
	try {
		const order = await db.order.findByPk(id);
		if (order) {
			await order.destroy();
			res.json({ message: `Order ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Order ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
