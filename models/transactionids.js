'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactionIds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactionIds.belongsTo(models.User,
        
        {
          foreignKey:'f_key', targetKey:'id'
        })
    }
  }
  transactionIds.init({
    f_key: DataTypes.INTEGER,
    transactionID: DataTypes.STRING,
    isUsed: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactionIds',
  });
  return transactionIds;
};