'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Menu.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    detail: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    image: DataTypes.STRING,
    updated_at: DataTypes.DATE
  }, {
    timestamps:false,
    underscored: true,
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};
