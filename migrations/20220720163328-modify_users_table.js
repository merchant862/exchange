'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 
      'address' ,{
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      }
    );

    await queryInterface.addColumn('Users',
      'privateKey', {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','address');
    await queryInterface.removeColumn('Users','privateKey');
  }
};