var express = require("express");
var router = express.Router();
const db = require("../models");

/* GET ALL TRANSACTIONS */
router.get("/", async function (req, res, next) {
	try {
		const transactions = await db.transaction.findAll();
		res.json({ error: false, list: transactions });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

/* GET ONE TRANSACTION */
router.get("/:id", async function (req, res, next) {
	const id = req.params.id;
	try {
		const transaction = await db.transaction.findByPk(id);
		if (transaction) {
			res.json(transaction);
		} else {
			res.status(404).json({ error: `Transaction ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* ADD ONE TRANSACTION */
router.post("/", async function (req, res, next) {
	try {
		const newTransaction = await db.transaction.create({ ...req.body });
		res.status(201).json(newTransaction);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* UPDATE ONE TRANSACTION */
router.put("/:id", async function (req, res, next) {
	const id = req.params.id;
	const { order_id, user_id, shipping_dock_id, amount, notes } = req.body;
	try {
		const transaction = await db.transaction.findByPk(id);
		if (transaction) {
			await transaction.update({
				order_id:
					order_id !== undefined ? order_id : transaction.order_id,
				user_id: user_id !== undefined ? user_id : transaction.user_id,
				shipping_dock_id:
					shipping_dock_id !== undefined
						? shipping_dock_id
						: transaction.shipping_dock_id,
				amount: amount !== undefined ? amount : transaction.amount,
				notes: notes !== undefined ? notes : transaction.notes,
			});
			res.json({ message: `Transaction ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `Transaction ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* DELETE ONE TRANSACTION */
router.delete("/:id", async function (req, res, next) {
	const id = req.params.id;
	try {
		const transaction = await db.transaction.findByPk(id);
		if (transaction) {
			await transaction.destroy();
			res.json({ message: `Transaction ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Transaction ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
