'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      orders.belongsTo(models.User,
        {
          foreignKey:'f_key', targetKey:'id'
        })
    }
  }
  orders.init({
    f_key: DataTypes.INTEGER,
    serial: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    coin: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'orders',
  });
  return orders;
};