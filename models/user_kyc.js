'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_kyc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_kyc.belongsTo(models.User,
        {
          foreignKey:'f_key', targetKey:'id'
        })
    }
  }
  user_kyc.init({
    f_key: DataTypes.INTEGER,
    no_of_tries: DataTypes.INTEGER,
    KYC_LEVEL_1: DataTypes.STRING,
    KYC_LEVEL_2: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user_kyc',
  });
  return user_kyc;
};