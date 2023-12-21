// userRoutes.js
const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const db = require("../models");

// GET all users
router.get("/", async (req, res) => {
	try {
		const users = await db.user.findAll();
		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: error });
	}
});

// GET one user by ID
router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await db.user.findByPk(id);
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ error: `User ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// POST add a new user
router.post("/", async (req, res) => {
	try {
		const newUser = await db.user.create({ ...req.body });
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// PUT update a user by ID
router.put("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await db.user.findByPk(id);
		if (user) {
			await user.update({ ...req.body });
			res.json({ message: `User ${id} updated successfully` });
		} else {
			res.status(404).json({ error: `User ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// DELETE a user by ID
router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await db.user.findByPk(id);
		if (user) {
			await user.destroy();
			res.json({ message: `User ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `User ${id} not found` });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

/*Custom API*/

router.post("/wallet", async (req, res) => {
	try {
		// Create a new Ethereum account
		const newAccount = web3.eth.accounts.create();

		const userId = req.body.userId;
		const walletId = newAccount.address;

		const user = await db.user.findByPk(userId);
		if (user) {
			user.walletId = walletId;
			await user.save();
		}
		// Return the private key to the client (for demonstration purposes, handle this securely in production)
		const privateKey = newAccount.privateKey;

		res.json({
			walletId,
			privateKey,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/sign", (req, res) => {
	try {
		const privateKey = req.query.private_key;

		// Sign a unique message using the private key
		const message = web3.utils.sha3("unique message to sign");
		const signature = web3.eth.accounts.sign(message, privateKey);

		res.json({
			message,
			signature,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/account", async (req, res) => {
	try {
		const privateKey = req.query.private_key;

		// Get the account address from the private key
		const account = web3.eth.accounts.privateKeyToAccount(privateKey);
		const address = account.address;

		// Get the balance of the account
		const balance = await web3.eth.getBalance(address);

		res.json({
			address,
			balance: web3.utils.fromWei(balance, "ether"),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
