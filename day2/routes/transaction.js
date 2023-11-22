var express = require("express");
const {
  getTransactions,
  createTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  seedTransactions,
} = require("../controllers/Transactions");
var router = express.Router();

/* GET Transaction listing. */
router.get("/", getTransactions).post("/", createTransactions);
router
  .get("/seed/:amount", seedTransactions)
  .get("/:id", getTransaction)
  .put("/:id", updateTransaction)
  .delete("/:id", deleteTransaction);

module.exports = router;
