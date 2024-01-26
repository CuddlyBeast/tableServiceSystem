const { Order } = require("../models");
const validator = require('validator');

const placeOrder = async (req, res) => {
    try {
        const { order_num, user_id, menu_id, qty, price } = req.body; 
        const userId = req.user.id;
        
        const latestOrder = await Order.findOne({
            attributes: ['order_num'],
            order: [['order_num', 'DESC']],
        })

        const newOrderNum = latestOrder ? parseInt(latestOrder.order_num, 10) + 1 : 1; // order_num originally set as a string

        const newOrder = await Order.create({
            order_num: newOrderNum,
            user_id: userId,
            menu_id,
            qty,
            price,
            updated_at: new Date(),
        });

        res.json({
            message: "Order successful",
            order: {
            id: newOrder.id,
            order_num: newOrder.order_num,
            user_id: newOrder.userId,
            menu_id: newOrder.menu_id,
            qty: newOrder.qty, 
            price: newOrder.price,
            updated_at: new Date(),
            }
        })

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

const viewOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findAll({ where: { user_id: userId } });
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const order = req.params.id;
        const userId = req.user.id

        if (!validator.isInt(order, { min: 1 })) {
            return res.status(400).send({ error: 'Invalid order ID'});
          }
        
        Order.destroy({ where: { order_num: order, user_id: userId }});
        res.send({ message: `Order number ${order} has been deleted.`});
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = { placeOrder, viewOrders, deleteOrder };