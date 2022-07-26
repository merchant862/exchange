'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      wallet.belongsTo(models.User,
        {
          foreignKey:'f_key', targetKey:'id'
        })
    }
  }
  wallet.init({
    f_key: DataTypes.INTEGER,
    BTC: DataTypes.FLOAT,
    ETH: DataTypes.FLOAT,
    BNB: DataTypes.FLOAT,
    SOL: DataTypes.FLOAT,
    DOT: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'wallet',
  });
  return wallet;
};