
const planModel = require("../../models/planModel");
const User = require("../../models/users");



const createPlan = async (req, res) => {
    try {

        const plan = await planModel.create(req.body);

        res.json({
            success: true,
            plan,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPlans = async (req, res) => {

    const plans = await planModel.find();

    res.json({
        success: true,
        plans,
    });
};


  

module.exports = { getPlans, createPlan };