const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const db = require("../models");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
	res.render("import");
});

router.post("/", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded." });
		}

		const results = [];
		const file = req.file.path;

		require("fs")
			.createReadStream(file)
			.pipe(csv())
			.on("data", (data) => results.push(data))
			.on("end", async () => {
				for (const result of results) {
					await db.transaction.create({
						order_id: result.order_id,
						user_id: result.user_id,
						shipping_dock_id: result.shipping_dock_id,
						amount: result.amount,
						discount: result.discount,
						tax: result.tax,
						total: result.total,
						notes: result.notes,
						status: result.status,
					});
				}

				res.json({ message: "Data imported successfully." });
			});
	} catch (error) {
		console.error("Error during import:", error);
		res.status(500).json({ error: "Internal server error during import." });
	}
});

module.exports = router;
