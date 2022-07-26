'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
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
      BTC: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      ETH: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      BNB: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      SOL: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      DOT: {
        allowNull: true,
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('wallets');
  }
};