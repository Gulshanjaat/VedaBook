
const User = require("../../models/users");

const Subscription = require("../../models/subscriptionModel");
const Plan = require("../../models/planModel");

const createPlan = async (req, res) => {
    try {

        const plan = await Plan.create(req.body);

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

    const plans = await Plan.find();

    res.json({
        success: true,
        plans,
    });
};

const buySubscription = 
    async (req, res) => {

        const { userId, planId } = req.body;

        const plan =
            await Plan.findById(planId);

        const user =
            await User.findById(userId);

        const endDate = new Date();

        endDate.setDate(
            endDate.getDate() +
            plan.durationDays
        );

        await Subscription.create({

            userId,

            planId,

            endDate,

            status: "active",
        });

        user.tokens += plan.tokens;

        await user.save();

        res.json({
            success: true,

            message:
                "Subscription activated",
        });
    };

module.exports = { getPlans, createPlan,buySubscription };