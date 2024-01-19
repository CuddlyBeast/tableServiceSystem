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
    orderNum: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    timestamps: true,
    underscored: true,
    sequelize,
    modelName: 'order',
  });

  Menu.beforeCreate((menu, options) => {
    menu.date = new Date();
  });


  Menu.beforeUpdate((menu, options) => {
    menu.date = new Date();
  });

  return Order;
};