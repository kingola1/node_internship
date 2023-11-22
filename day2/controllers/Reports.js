const asyncHandler = require("express-async-handler");
const db = require("../models");
const Transactions = require("../models/transaction")(
	db.sequelize,
	db.Sequelize
);
const Orders = require("../models/order")(db.sequelize, db.Sequelize);
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;

// @desc      Get All Sales Report
// @route     GET /api/v1/report/sale?month=1&year
// @access    Public
const getReports = asyncHandler(async (req, res) => {
	const { month, year, from_date, to_date } = req.query;

	// Check if both month and year are provided
	if (month && year) {
		const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JavaScript Date object
		const endDate = new Date(year, month, 0);
		// console.table({
		//   startDate: startDate.toISOString(),
		//   endDate: endDate.toISOString(),
		// });
		const result = await Transactions.findAll({
			attributes: [
				[Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"],
			],
			where: {
				created_at: {
					[Op.between]: [startDate, endDate],
				},
			},
			raw: true,
		});
		// console.log(result);

		res.status(200);
		res.json({ error: false, total_amount: result[0].total_amount || 0 });
	} // Check if both from_date and to_date are provided
	else if (from_date && to_date) {
		// Check if the dates are valid
		if (!from_date || !to_date) {
			return res.status(400).json({ error: "Invalid date range" });
		}

		// Parse the dates
		let from = new Date(from_date);
		let to = new Date(to_date);

		// Check if the dates are swapped
		if (from > to) {
			// Swap the dates
			[from, to] = [to, from];
		}

		// Query the database and calculate the total amount
		const totalAmount = await Transactions.sum("amount", {
			where: {
				created_at: {
					[Op.between]: [from, to],
				},
			},
		});

		res.status(200);
		res.json({ error: false, total_amount: totalAmount || 0 });
	}
});

// @desc      Get Monthly Sales for the Year
// @route     GET /api/v1/report/monthly?year=2023
// @access    Public
const getMonthlySalesPerYear = asyncHandler(async (req, res) => {
	const { year } = req.query;

	const monthlySales = await Transactions.findAll({
		attributes: [
			[Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
			[Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"],
		],
		where: Sequelize.where(
			Sequelize.fn("YEAR", Sequelize.col("created_at")),
			year
		),
		group: Sequelize.fn("MONTH", Sequelize.col("created_at")),
		raw: true,
		having: Sequelize.literal("total_amount > 0"),
	});

	res.status(200);
	res.json({ error: false, monthlySales });
});

// @desc      Get Monthly Sales for given Year by given user
// @route     GET /api/v1/report/user?year=2022&user_id=1
// @access    Public
const getMonthlySalesPerYearByUser = asyncHandler(async (req, res) => {
	const { year, user_id } = req.query;

	const monthlySales = await Transactions.findAll({
		attributes: [
			[Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
			[Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"],
		],
		where: {
			[Sequelize.Op.and]: [
				Sequelize.where(
					Sequelize.fn("YEAR", Sequelize.col("created_at")),
					year
				),
				{ user_id },
			],
		},
		group: Sequelize.fn("MONTH", Sequelize.col("created_at")),
		raw: true,
		having: Sequelize.literal("total_amount > 0"),
	});

	res.status(200);
	res.json({ error: false, monthlySales });
});

// @desc      Get Monthly Sales for given Year by given shipping dock
// @route     GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1
// @access    Public
const getMonthlySalesPerYearByShippingDock = asyncHandler(async (req, res) => {
	const { year, shipping_dock_id } = req.query;

	// Calculate the sale amount per month for the specified year and shipping dock ID
	const monthlySales = await Transactions.findAll({
		attributes: [
			[Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
			[Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"],
		],
		where: {
			shipping_dock_id: parseInt(shipping_dock_id),
			created_at: {
				[Op.between]: [
					`${year}-01-01 00:00:00`,
					`${year}-12-31 23:59:59`,
				],
			},
		},
		group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
		having: {
			total_amount: {
				[Op.gt]: 0,
			},
		},
	});

	res.status(200);
	res.json({ error: false, monthlySales });
});

// @desc      Get Monthly Order Count for given Year by given user
// @route     GET /api/v1/report/user/count?year=2022&user_id=1
// @access    Public
const getOrderCountPerYearByUser = asyncHandler(async (req, res) => {
	const { year, user_id } = req.query;

	// Calculate the number of orders per month for the specified year and user ID
	const result = await Orders.findAll({
		attributes: [
			[Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
			[Sequelize.fn("COUNT", Sequelize.col("id")), "order_count"],
		],
		where: {
			user_id: parseInt(user_id),
			created_at: {
				[Op.between]: [
					`${year}-01-01 00:00:00`,
					`${year}-12-31 23:59:59`,
				],
			},
		},
		raw: true,
		group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
	});
	// Create an object to store the result, including months with 0 sale
	const resultMap = [];
	for (let i = 1; i <= 12; i++) {
		resultMap.push({ month: i, order_count: 0 });
	}

	// Populate the result map with the actual order counts
	result.forEach((row) => {
		console.log(row);
		const index = resultMap.findIndex((map) => map.month === row.month);
		if (index > -1) {
			resultMap.splice(index, 1, row);
		}
		//  = row.order_count;
	});

	res.status(200);
	res.json({ error: false, order_count: resultMap });
});

module.exports = {
	getReports,
	getMonthlySalesPerYear,
	getOrderCountPerYearByUser,
	getMonthlySalesPerYearByUser,
	getMonthlySalesPerYearByShippingDock,
};
