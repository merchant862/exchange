'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      f_key: {
        allowNull: false,
        references:
        {
           model:'users',
           key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        type: Sequelize.INTEGER
      },
      serial: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      coin: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};