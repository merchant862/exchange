'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'KYCtries');
    await queryInterface.removeColumn('Users', 'isKYCDone');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users','KYCtries' ,{
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('Users','isKYCDone' ,{
      allowNull: true,
      type: Sequelize.STRING,
    });
  }
};
