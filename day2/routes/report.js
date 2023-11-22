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

// GET /api/v1/report/sale?month=1&year=2023
router.get("/sale", async (req, res) => {
	try {
		const month = parseInt(req.query.month);
		const year = parseInt(req.query.year);

		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0, 23, 59, 59);

		const totalAmount = await db.order.sum("amount", {
			where: {
				createdAt: {
					[db.Sequelize.Op.between]: [startDate, endDate],
				},
			},
		});

		res.json({ month, year, totalAmount });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/report/sale?from_date=2022-01-01&to_date=2022-02-02
router.get("/sale/date-range", async (req, res) => {
	try {
		const fromDate = new Date(req.query.from_date);
		const toDate = new Date(req.query.to_date);

		const totalAmount = await db.order.sum("amount", {
			where: {
				createdAt: {
					[db.Sequelize.Op.between]: [fromDate, toDate],
				},
			},
		});

		res.json({ from_date: fromDate, to_date: toDate, totalAmount });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/report/monthly?year=2022
router.get("/monthly", async (req, res) => {
	try {
		const year = parseInt(req.query.year);

		const monthlySales = await db.order.findAll({
			attributes: [
				[
					db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
					"month",
				],
				[
					db.Sequelize.fn("SUM", db.Sequelize.col("amount")),
					"totalAmount",
				],
			],
			where: {
				createdAt: {
					[db.Sequelize.Op.between]: [
						new Date(year, 0),
						new Date(year + 1, 0),
					],
				},
			},
			group: [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt"))],
		});

		res.json({ year, monthlySales });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/report/user?year=2022&user_id=1
router.get("/user", async (req, res) => {
	try {
		const year = parseInt(req.query.year);
		const user_id = parseInt(req.query.user_id);

		const monthlySales = await db.order.findAll({
			attributes: [
				[
					db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
					"month",
				],
				[
					db.Sequelize.fn("SUM", db.Sequelize.col("amount")),
					"totalAmount",
				],
			],
			where: {
				user_id,
				createdAt: {
					[db.Sequelize.Op.between]: [
						new Date(year, 0),
						new Date(year + 1, 0),
					],
				},
			},
			group: [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt"))],
		});

		res.json({ year, user_id, monthlySales });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1
router.get("/shipping_dock", async (req, res) => {
	try {
		const year = parseInt(req.query.year);
		const shipping_dock_id = parseInt(req.query.shipping_dock_id);

		const monthlySales = await db.order.findAll({
			attributes: [
				[
					db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
					"month",
				],
				[
					db.Sequelize.fn("SUM", db.Sequelize.col("amount")),
					"totalAmount",
				],
			],
			where: {
				shipping_dock_id,
				createdAt: {
					[db.Sequelize.Op.between]: [
						new Date(year, 0),
						new Date(year + 1, 0),
					],
				},
			},
			group: [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt"))],
		});

		res.json({ year, shipping_dock_id, monthlySales });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// GET /api/v1/report/user/count?year=2022&user_id=1
router.get("/user/count", async (req, res) => {
	try {
		const year = parseInt(req.query.year);
		const user_id = parseInt(req.query.user_id);

		const monthlyOrderCount = await db.order.findAll({
			attributes: [
				[
					db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
					"month",
				],
				[
					db.Sequelize.fn("COUNT", db.Sequelize.col("id")),
					"orderCount",
				],
			],
			where: {
				user_id,
				createdAt: {
					[db.Sequelize.Op.between]: [
						new Date(year, 0),
						new Date(year + 1, 0),
					],
				},
			},
			group: [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt"))],
		});

		res.json({ year, user_id, monthlyOrderCount });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

module.exports = router;
