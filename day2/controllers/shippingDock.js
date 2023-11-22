const asyncHandler = require("express-async-handler");
const db = require("../models");
const ShippingDock = require("../models/shipping_dock")(
	db.sequelize,
	db.Sequelize
);

// @desc      Create Shipping Dock
// @route     POST /api/v1/shipping_dock
// @access    Public
const createshippingDocks = asyncHandler(async (req, res) => {
	const shippingDocks = await ShippingDock.create({ ...req.body });

	if (!shippingDocks) {
		res.status(404);
		throw new Error("An Error!");
	}

	res.status(201);
	res.json({ error: false, message: `Shipping dock created succefully!` });
});

// @desc      Get All Shipping
// @route     GET /api/v1/shipping_dock
// @access    Public
const getshippingDocks = asyncHandler(async (req, res) => {
	const shippingDocks = await ShippingDock.findAll({});

	if (!shippingDocks.length) {
		res.status(404);
		throw new Error("There are no shipping dock data found!");
	}

	res.status(200);
	res.json({ error: false, list: shippingDocks });
});

// @desc      Get Shipping dock by ID
// @route     GET /api/v1/shipping_dock/:id
// @access    Public
const getshippingDock = asyncHandler(async (req, res) => {
	const id = req?.params?.id;
	const shipping_dock = await ShippingDock.findByPk(id);

	if (!shipping_dock) {
		res.status(404);
		throw new Error(`Shipping dock with id: ${id} not found!`);
	}

	res.status(200);
	res.json({ error: false, data: shipping_dock });
});

// @desc      Update Shipping dock by ID
// @route     PUT /api/v1/shipping_dock/:id
// @access    Public
const updateShippingDock = asyncHandler(async (req, res) => {
	const id = req?.params?.id;
	const { name, status } = req?.body;
	const allowedEdits = ["name", "status"];

	const editKeys = Object.keys(req?.body);
	const isValidEdit = editKeys.every((key) => allowedEdits.includes(key));
	if (!isValidEdit) {
		res.status(400);
		throw new Error(
			`Invalid Update - allowed updates are "name" and "status"`
		);
	}
	const shipping_dock = await ShippingDock.findByPk(id);

	if (!shipping_dock) {
		res.status(404);
		throw new Error(`Shipping dock with id: ${id} not found!`);
	}

	const updateFields = {};
	if (name) {
		updateFields.name = name;
	}
	if (status !== undefined) {
		updateFields.status = status;
	}

	await ShippingDock.update(updateFields, {
		where: {
			id: id,
		},
	});

	const updatedShippingDock = await ShippingDock.findOne({
		where: { id: id },
	});

	res.status(200);
	res.json({
		error: false,
		message: `Shipping dock updated successfully!`,
		data: updatedShippingDock,
	});
});

// @desc      Delete Shipping dock by ID
// @route     DELETE /api/v1/shipping_dock/:id
// @access    Public
const deleteShippingDock = asyncHandler(async (req, res) => {
	const id = req?.params?.id;
	const { name, status } = req?.body;

	const shipping_dock = await ShippingDock.findByPk(id);

	if (!shipping_dock) {
		res.status(404);
		throw new Error(`Shipping dock with id: ${id} not found!`);
	}

	const deletedShippingDock = await shipping_dock.destroy();

	res.status(200);
	res.json({
		error: false,
		message: `Shipping dock deleted successfully!`,
		data: deletedShippingDock,
	});
});

module.exports = {
	getshippingDocks,
	getshippingDock,
	createshippingDocks,
	updateShippingDock,
	deleteShippingDock,
};
