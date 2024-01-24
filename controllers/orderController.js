const { or } = require("sequelize");
const { Order } = require("../models");

const placeOrder = async (req, res) => {
    try {
        const { order_num, user_id, menu_id, qty, price } = req.body; 
        const userId = req.user.id;

        const newOrder = await Order.create({
            order_num,
            user_id: userId,
            menu_id,
            qty,
            price,
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
            created_at: new Date(),
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
        
        Order.destroy({ where: { order_num: order, user_id: userId }});
        res.send({ message: `Order number ${order} has been deleted.`});
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = { placeOrder, viewOrders, deleteOrder };