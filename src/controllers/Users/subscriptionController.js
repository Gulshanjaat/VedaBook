const razorpay = require("../../config/razorpay");
const userModel = require("../../models/users.js");
const subscriptionModel = require("../../models/subscriptionModel.js");

const Plan = require("../../models/planModel");

const createOrder =
    async (req, res) => {

        try {

            const { planId } =
                req.body;

            const plan =
                await Plan.findById(planId);

            if (!plan) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Plan not found",
                });
            }

            const order =
                await razorpay.orders.create({

                    amount:
                        plan.price * 100,

                    currency: "INR",

                    receipt:
                        "receipt_" +
                        Date.now(),
                });

            res.json({

                success: true,

                order,

            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };


const crypto =
    require("crypto");


const verifyPayment =
async (req, res) => {

  try {

    const {

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      userId,
      planId,

    } = req.body;

    const sign = crypto

      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )

      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )

      .digest("hex");

    if (
      sign !==
      razorpay_signature
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Payment verification failed",

      });
    }

    const plan =
      await Plan.findById(planId);

    const user =
      await userModel.findById(userId);

    const endDate =
      new Date();

    endDate.setDate(
      endDate.getDate() +
      plan.durationDays
    );

    await subscriptionModel.create({

      userId,

      planId,

      startDate:
        new Date(),

      endDate,

      status:
        "active",

    });

    user.tokens +=
      plan.tokens;

    await user.save();

    return res.json({

      success: true,

      message:
        "Subscription activated",

      tokens:
        user.tokens,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};



module.exports = { createOrder, verifyPayment};