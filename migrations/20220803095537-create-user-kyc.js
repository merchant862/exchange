'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_kycs', {
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
           model:'Users',
           key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        type: Sequelize.INTEGER
      },
      face_pic: {
        type: Sequelize.STRING
      },
      id_pic: {
        type: Sequelize.STRING
      },
      address_pic: {
        type: Sequelize.STRING
      },
      no_of_tries: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('user_kycs');
  }
};