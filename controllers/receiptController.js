// Turned out to be unnecessary

const { Order, sequelize } = require("../models");
const validator = require('validator');

const provideReceipt = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;

        if (!validator.isInt(orderId, { min: 1 })) {
          return res.status(400).send({ error: 'Invalid order ID'});
        }

        const result = await Order.findOne({  
            attributes: [
            'order_num',
            [sequelize.fn('SUM', sequelize.col('price')), 'total_price'],
          ],
          where: {
            order_num: orderId,
            user_id: userId,
          },
          group: ['order_num'],
        });

        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
          }

        return res.send({
            message: 'Receipt generated successfully',
            order_num: orderId,
            receipt: result,
          });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error"});
    }
}

module.exports = { provideReceipt };