'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 
      'isKYCDone' ,{
        allowNull: true,
        type: Sequelize.STRING,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users','isKYCDone');
  }
};