const asyncHandler = require("express-async-handler");
const db = require("../models");
const { buildOrderList } = require("../services/Orders");
const Orders = require("../models/orders")(db.sequelize, db.Sequelize);
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

// @desc      Create Orders
// @route     POST /api/v1/order
// @access    Public
const createOrders = asyncHandler(async (req, res) => {
  const orders = await Orders.create({ ...req.body });

  if (!orders) {
    res.status(404);
    throw new Error("Unable to create order!");
  }

  res.status(201);
  res.json({ error: false, message: `Orders created succefully!` });
});

// @desc      Get All Orders
// @route     POST /api/v1/order/all?page=1&limit=10&sort=id&direction=DESC
// @access    Public
const getOrders = asyncHandler(async (req, res) => {
  const body = req?.body;
  const page = Number(req?.query?.page) || 1; // current page number
  const limit = Number(req?.query?.limit) || 10; // number of items per page
  const offset = (page - 1) * limit; // offset calculation
  const sortBy = req?.query?.sort || "createdAt"; // sorting column
  const sortOrder = req?.query?.direction || "DESC"; // sorting order
  const order = [[sortBy, sortOrder]]; // sorting order array
  console.log("before body");
  const notes =
    body && body?.payload && body?.payload?.notes ? body?.payload?.notes : null;

  console.log("after body");
  const where = {};
  if (notes) {
    where.notes = {
      [Op.like]: `%${notes}%`, // using Op.like to allow regex match
    };
  }
  console.log("after where");
  // find all items with pagination and sorting
  const { count, rows } = await Orders.findAndCountAll({
    where,
    limit,
    offset,
    order,
  });

  // calculate the total pages
  const totalPages = Math.ceil(count / limit);

  // if (!orders.length) {
  //   res.status(404);
  //   throw new Error("There are no Orders data found!");
  // }

  res.status(200);
  res.json({
    error: false,
    list: rows,
    total: count,
    page,
    limit,
    num_pages: totalPages,
  });
});

// @desc      Get All Orders cursor paginate `offset as id`
// @route     GET /api/v1/order/cursor?id=1&limit=10
// @access    Public
const getCursorOrders = asyncHandler(async (req, res) => {
  const offset = Number(req?.query?.id) || 0;
  const limit = Number(req?.query?.limit) || 10;
  const order = [["id", "ASC"]];

  const where = offset ? { id: { [Op.gt]: offset } } : {};

  const orders = await Orders.findAll({
    where,
    limit,
    order,
  });

  const nextCursor = orders.length > 0 ? orders[orders.length - 1].id : null;

  res.status(200);
  res.json({
    error: false,
    list: orders,
    id: offset,
    nextCursor,
    limit,
  });
});

// @desc      Get All Odd Orders
// @route     GET /api/v1/order/odd
// @access    Public
const getOddOrders = asyncHandler(async (req, res) => {
  const orders = await Orders.findAll({
    where: sequelize.literal("id % 2 = 1"),
  });

  if (!orders.length) {
    res.status(404);
    throw new Error("There are no Orders data found!");
  }

  res.status(200);
  res.json({ error: false, list: orders });
});

// @desc      Get Orders by ID
// @route     GET /api/v1/order/:id
// @access    Public
const getOrder = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  const order = await Orders.findByPk(id);

  if (!order) {
    res.status(404);
    throw new Error(`Orders with id: ${id} not found!`);
  }

  res.status(200);
  res.json({ error: false, data: order });
});

// @desc      Update Orders by ID
// @route     PUT /api/v1/order/:id
// @access    Public
const updateOrder = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  const { user_id, amount, tax, notes, status } = req?.body;
  const allowedEdits = ["user_id", "amount", "tax", "notes", "status"];

  const editKeys = Object.keys(req?.body);
  const isValidEdit = editKeys.every((key) => allowedEdits.includes(key));
  if (!isValidEdit) {
    res.status(400);
    throw new Error(
      `Invalid Update - allowed updates are "user_id", "amount", "tax", "notes", "status"`
    );
  }
  const order = await Orders.findByPk(id);

  if (!order) {
    res.status(404);
    throw new Error(`Order with id: ${id} not found!`);
  }

  const updateFields = {};
  if (user_id) {
    updateFields.user_id = user_id;
  }
  if (amount) {
    updateFields.amount = amount;
  }
  if (tax) {
    updateFields.tax = tax;
  }
  if (notes) {
    updateFields.notes = notes;
  }
  if (status !== undefined) {
    updateFields.status = status;
  }

  await Orders.update(updateFields, {
    where: {
      id: id,
    },
  });

  const updatedOrder = await Orders.findOne({ where: { id: id } });

  res.status(200);
  res.json({
    error: false,
    message: `Order updated successfully!`,
    data: updatedOrder,
  });
});

// @desc      Delete Orders by ID
// @route     DELETE /api/v1/order/:id
// @access    Public
const deleteOrder = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  const order = await Orders.findByPk(id);

  if (!order) {
    res.status(404);
    throw new Error(`Order with id: ${id} not found!`);
  }

  const deletedOrder = await order.destroy();

  res.status(200);
  res.json({
    error: false,
    message: `Order deleted successfully!`,
    data: deletedOrder,
  });
});

// @desc      GET Seed Orders
// @route     GET /api/v1/order/seed/:amount?user_id=1
// @access    Public
const seedOrders = asyncHandler(async (req, res) => {
  const amount = req?.params?.amount || 10;
  const { user_id } = req?.query;
  const orderList = buildOrderList(Number(amount), Number(user_id));

  console.log(orderList);
  await Orders.bulkCreate(orderList);

  res.status(200);
  res.json({
    error: false,
    message: `Orders Created successfully!`,
  });
});

module.exports = {
  getOrder,
  getOrders,
  seedOrders,
  updateOrder,
  deleteOrder,
  createOrders,
  getOddOrders,
  getCursorOrders,
};
