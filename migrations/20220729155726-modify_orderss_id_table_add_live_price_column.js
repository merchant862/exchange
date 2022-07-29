'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 
      'price' ,{
        allowNull: false,
        type: Sequelize.FLOAT,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders','price');
  }
};