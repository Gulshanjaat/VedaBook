const express = require("express");

const planrouter = express.Router();

const { getPlans,  createPlan, } = require("../../controllers/Users/planController");

planrouter.post("/create-plan", createPlan);
planrouter.get("/plans", getPlans);

// psrouter.post("/buy", buySubscription);

module.exports = planrouter;