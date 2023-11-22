var express = require("express");
var router = express.Router();
const db = require("../models");

/* GET ALL SHIPPING DOCKS */
router.get("/", async function (req, res, next) {
	try {
		const shippingDocks = await db.shipping_dock.findAll();
		res.json({ error: false, list: shippingDocks });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

/* GET ONE SHIPPING DOCK */
router.get("/:id", async function (req, res, next) {
	const id = req.params.id;
	try {
		const shippingDock = await db.shipping_dock.findByPk(id);
		if (shippingDock) {
			res.json(shippingDock);
		} else {
			res.status(404).json({ error: `Shipping Dock ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* ADD ONE SHIPPING DOCK */
router.post("/", async function (req, res, next) {
	try {
		const newShippingDock = await db.shipping_dock.create({ ...req.body });
		res.status(201).json(newShippingDock);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* UPDATE ONE SHIPPING DOCK */
router.put("/:id", async function (req, res, next) {
	const id = req.params.id;
	const { name, status } = req.body;
	try {
		const shippingDock = await db.shipping_dock.findByPk(id);
		if (shippingDock) {
			await shippingDock.update({
				name: name !== undefined ? name : shippingDock.name,
				status: status !== undefined ? status : shippingDock.status,
			});
			res.json({ message: `Shipping Dock ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `Shipping Dock ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/* DELETE ONE SHIPPING DOCK */
router.delete("/:id", async function (req, res, next) {
	const id = req.params.id;
	try {
		const shippingDock = await db.shipping_dock.findByPk(id);
		if (shippingDock) {
			await shippingDock.destroy();
			res.json({ message: `Shipping Dock ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Shipping Dock ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
