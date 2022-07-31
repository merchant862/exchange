'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 
      'KYCtries' ,{
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','KYCtries');
  }
};
