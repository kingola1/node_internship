var express = require("express");
const {
  getshippingDocks,
  createshippingDocks,
  getshippingDock,
  updateShippingDock,
  deleteShippingDock,
} = require("../controllers/shippingDock");
var router = express.Router();

/* GET Shipping dock listing. */
router.get("/", getshippingDocks).post("/", createshippingDocks);
router
  .get("/:id", getshippingDock)
  .put("/:id", updateShippingDock)
  .delete("/:id", deleteShippingDock);

module.exports = router;
