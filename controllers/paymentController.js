const { Order } = require("../models");
const validator = require('validator');

const confirmOrder = async (req, res) => {
    try {
        const { payment_method } = req.body;
        const userId = req.user.id;
        const orderId = req.params.id;

        if (!validator.isInt(orderId, { min: 1 })) {
            return res.status(400).send({ error: 'Invalid order ID'});
          }

        const last4Digits = payment_method.slice(-4);
        const maskedPaymentMethod = `card ending in *${last4Digits}`;

        const [numUpdatedRows, updatedOrders] = await Order.update(
            {
                paid_with: maskedPaymentMethod,
            },
            {
                where: {
                    user_id: userId,
                    order_num: orderId,
                },
                returning: true, 
            }
        );

        if (numUpdatedRows === 0) {
            return res.status(404).send({ error: 'No orders found to update.' });
        }

        res.send({
            message: "Payment Successful",
            order_num: updatedOrders[0].order_num, 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

module.exports = { confirmOrder };