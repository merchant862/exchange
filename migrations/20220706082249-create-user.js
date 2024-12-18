'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      privateKey: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      verified: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      verification_token: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      password_reset_token: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      USDT_balance: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      KYCtries: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isKYCDone: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Users');
  }
};