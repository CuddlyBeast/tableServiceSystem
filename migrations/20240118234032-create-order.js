'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_num: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      menu_id: {
        type: Sequelize.INTEGER
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      paid: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      paid_with: {
        allowNull: false,
        defaultValue: "not applicable",
        type: Sequelize.STRING
      },
      table_num: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      address: {
        type: Sequelize.STRING,
        defaultValue: "n/a"
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};