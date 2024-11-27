'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 
      'isKYCDone' ,{
        allowNull: true,
        type: Sequelize.STRING,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','isKYCDone');
  }
};