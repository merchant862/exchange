'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 
      'address' ,{
        allowNull: true,
        type: Sequelize.TEXT,
        unique: true
      }
    );

    await queryInterface.addColumn('users',
      'privateKey', {
        allowNull: true,
        type: Sequelize.TEXT,
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users','address');
    await queryInterface.removeColumn('users','privateKey');
  }
};