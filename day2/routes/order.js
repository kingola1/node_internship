const express = require("express");
const router = express.Router();
const db = require("../models");

// Function to calculate total pages
const calculateTotalPages = (totalCount, limit) =>
	Math.ceil(totalCount / limit);

// Function to handle pagination
const paginateResults = (page, limit, results) => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	return results.slice(startIndex, endIndex);
};

// GET /api/v1/order/odd
router.get("/odd", async (req, res) => {
	try {
		const orders = await db.order.findAll({
			where: {
				id: {
					[db.Sequelize.Op.and]: [db.Sequelize.literal("id % 2 = 1")],
				},
			},
		});
		res.json({ list: orders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/order?page=1&limit=10
router.get("/", async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const { count, rows: orders } = await db.order.findAndCountAll();
		const totalPages = calculateTotalPages(count, limit);
		const paginatedOrders = paginateResults(page, limit, orders);

		res.json({ total: count, page, totalPages, list: paginatedOrders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/order?page=1&limit=10&sort=id&direction=DESC
router.get("/sort", async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const sortField = req.query.sort || "id";
		const direction = req.query.direction || "ASC";

		const { count, rows: orders } = await db.order.findAndCountAll({
			order: [[sortField, direction]],
		});

		const totalPages = calculateTotalPages(count, limit);
		const paginatedOrders = paginateResults(page, limit, orders);

		res.json({ total: count, page, totalPages, list: paginatedOrders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/order/cursor?id=20&limit=10
router.get("/cursor", async (req, res) => {
	try {
		const id = parseInt(req.query.id) || 0;
		const limit = parseInt(req.query.limit) || 10;

		const orders = await db.order.findAll({
			where: {
				id: {
					[db.Sequelize.Op.gt]: id,
				},
			},
			limit,
		});

		res.json({ id, list: orders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Sample implementation for other report routes...
// (Note: You may need to adjust these routes based on your actual models and business logic)

module.exports = router;
