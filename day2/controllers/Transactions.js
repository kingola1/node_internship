const asyncHandler = require("express-async-handler");
const db = require("../models");
const { buildTransactionList } = require("../services/Transactions");
const Transactions = require("../models/transaction")(
	db.sequelize,
	db.Sequelize
);

// @desc      Create Transactions
// @route     POST /api/v1/transaction
// @access    Public
const createTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transactions.create({ ...req.body });

	if (!transactions) {
		res.status(404);
		throw new Error("Unable to create transaction!");
	}

	res.status(201);
	res.json({ error: false, message: `Transaction created succefully!` });
});

// @desc      Get All Transactions
// @route     GET /api/v1/transaction
// @access    Public
const getTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transactions.findAll({});

	if (!transactions.length) {
		res.status(404);
		throw new Error("There are no Transaction data found!");
	}

	res.status(200);
	res.json({ error: false, list: transactions });
});

// @desc      Get Transactions by ID
// @route     GET /api/v1/transaction/:id
// @access    Public
const getTransaction = asyncHandler(async (req, res) => {
	const id = req?.params?.id;
	const transaction = await Transactions.findByPk(id);

	if (!transaction) {
		res.status(404);
		throw new Error(`Transaction with id: ${id} not found!`);
	}

	res.status(200);
	res.json({ error: false, data: transaction });
});

// @desc      Update Transactions by ID
// @route     PUT /api/v1/transaction/:id
// @access    Public
const updateTransaction = asyncHandler(async (req, res) => {
	const id = req?.params?.id;
	const { user_id, amount, order_id, notes, shipping_dock_id } = req?.body;
	const allowedEdits = [
		"user_id",
		"amount",
		"order_id",
		"notes",
		"shipping_dock_id",
	];

	const editKeys = Object.keys(req?.body);
	const isValidEdit = editKeys.every((key) => allowedEdits.includes(key));
	if (!isValidEdit) {
		res.status(400);
		throw new Error(
			`Invalid Update - allowed updates are "user_id", "amount", "order_id", "notes", "shipping_dock_id"`
		);
	}
	const transaction = await Transactions.findByPk(id);

	if (!transaction) {
		res.status(404);
		throw new Error(`Transaction with id: ${id} not found!`);
	}

	const updateFields = {};
	if (user_id) {
		updateFields.user_id = user_id;
	}
	if (amount) {
		updateFields.amount = amount;
	}
	if (order_id) {
		updateFields.order_id = order_id;
	}
	if (notes) {
		updateFields.notes = notes;
	}
	if (shipping_dock_id !== undefined) {
		updateFields.shipping_dock_id = shipping_dock_id;
	}

	await Transactions.update(updateFields, {
		where: {
			id: id,
		},
	});

	const updatedTransaction = await Transactions.findOne({
		where: { id: id },
	});

	res.status(200);
	res.json({
		error: false,
		message: `Transaction updated successfully!`,
		data: updatedTransaction,
	});
});

// @desc      Delete Transactions by ID
// @route     DELETE /api/v1/transaction/:id
// @access    Public
const deleteTransaction = asyncHandler(async (req, res) => {
	const id = req?.params?.id;

	const transaction = await Transactions.findByPk(id);

	if (!transaction) {
		res.status(404);
		throw new Error(`Transaction with id: ${id} not found!`);
	}

	const deletedTransaction = await transaction.destroy();

	res.status(200);
	res.json({
		error: false,
		message: `Transaction deleted successfully!`,
		data: deletedTransaction,
	});
});

// @desc      GET Seed Transactions
// @route     GET /api/v1/transaction/seed/:amount?user_id=1&order_id=1&shipping_dock_id=1
// @access    Public
const seedTransactions = asyncHandler(async (req, res) => {
	const amount = req?.params?.amount || 10;
	const { user_id, order_id, shipping_dock_id } = req?.query;
	const transactionList = buildTransactionList(
		amount,
		Number(user_id),
		Number(order_id),
		Number(shipping_dock_id)
	);

	// console.log(transactionList);
	await Transactions.bulkCreate(transactionList);

	res.status(200);
	res.json({
		error: false,
		message: `Transactions Created successfully!`,
	});
});

//
module.exports = {
	getTransaction,
	getTransactions,
	updateTransaction,
	deleteTransaction,
	createTransactions,
	seedTransactions,
};
