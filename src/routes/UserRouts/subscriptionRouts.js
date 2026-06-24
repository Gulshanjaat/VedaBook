const express = require("express");
const { createOrder, verifyPayment } = require("../../controllers/Users/subscriptionController");

const subscriptionrouter = express.Router();


subscriptionrouter.post(
  "/createorder",
  createOrder
);

subscriptionrouter.post(
  "/verify-payment",
  verifyPayment
);

module.exports=subscriptionrouter