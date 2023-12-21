const express = require("express");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const db = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const transactions = await db.transaction.findAll();
		const csvWriter = createCsvWriter({
			path: "transactions.csv",
			header: [
				{ id: "id", title: "ID" },
				{ id: "order_id", title: "Order ID" },
				{ id: "user_id", title: "User ID" },
				{ id: "shipping_dock_id", title: "Shipping Dock ID" },
				{ id: "amount", title: "Amount" },
				{ id: "discount", title: "Discount" },
				{ id: "tax", title: "Tax" },
				{ id: "total", title: "Total" },
				{ id: "notes", title: "Notes" },
				{ id: "status", title: "Status" },
				{ id: "createdAt", title: "Created At" },
				{ id: "updatedAt", title: "Updated At" },
			],
		});

		await csvWriter.writeRecords(transactions);

		res.download("transactions.csv");
	} catch (error) {
		console.error("Error during export:", error);
		res.status(500).json({ error: "Internal server error during export." });
	}
});

module.exports = router;
