'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactionids', 
      'amount' ,{
        allowNull: false,
        type: Sequelize.STRING,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    //await queryInterface.removeColumn('transactionids','amount');
  }
};