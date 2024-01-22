const { Order } = require("../models");

const confirmOrder = async (req, res) => {
    try {
        const { order_num, payment_method } = req.body;
        const defaultPayment = req.user.payment_method;
        const userId = req.user.id;

        const [numUpdatedRows, updatedOrders] = await Order.update(
            {
                paid: true,
                paid_with: payment_method || defaultPayment,
            },
            {
                where: {
                    user_id: userId,
                    paid: false,
                    order_num: order_num,
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