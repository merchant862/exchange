'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_kycs','KYC_LEVEL_1' ,{
      allowNull: false,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('user_kycs','KYC_LEVEL_2' ,{
      allowNull: false,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('user_kycs','KYC_TRY_LEVEL_1' ,{
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('user_kycs','KYC_TRY_LEVEL_2' ,{
      allowNull: false,
      type: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_kycs', 'KYC_LEVEL_1');
    await queryInterface.removeColumn('user_kycs', 'KYC_LEVEL_2');
    await queryInterface.removeColumn('user_kycs', 'KYC_TRY_LEVEL_1');
    await queryInterface.removeColumn('user_kycs', 'KYC_TRY_LEVEL_2');
  }
};
