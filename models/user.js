'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.transactionIds,
        {
          foreignKey:'id'
        });
      
      User.hasMany(models.wallet,
          {
            foreignKey:'id'
          });
      User.hasMany(models.orders,
          {
            foreignKey:'id'
          });
      User.hasMany(models.user_kyc,
        {
          foreignKey:'id'
        });
    }
  }
  User.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    country: DataTypes.STRING,
    verified: DataTypes.STRING,
    verification_token: DataTypes.STRING,
    password_reset_token: DataTypes.STRING,
    otp: DataTypes.STRING,
    USDT_balance: DataTypes.FLOAT,
    buyLimitDiscountedPrice: DataTypes.FLOAT,
    address: DataTypes.STRING,
    privateKey: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};