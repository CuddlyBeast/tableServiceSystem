'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.Menu, { foreignKey: 'menu_id' });
    }
  }
  Order.init({
    order_num: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    paid: DataTypes.BOOLEAN,
    paid_with: DataTypes.STRING,
    table_num: DataTypes.INTEGER,
    address: DataTypes.STRING,
    updated_at: DataTypes.DATE
  }, {
    timestamps:false,
    underscored: true,
    sequelize,
    modelName: 'Order',
  });

  return Order;
};

