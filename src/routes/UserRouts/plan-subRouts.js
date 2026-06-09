const express = require("express");

const psrouter = express.Router();

const { getPlans, buySubscription, createPlan, } = require("../../controllers/Users/plan-subController");

psrouter.post("/create-plan", createPlan);
psrouter.get("/plans", getPlans);

psrouter.post("/buy", buySubscription);

module.exports = psrouter;