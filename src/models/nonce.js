'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nonce extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  nonce.init({
    key: DataTypes.STRING,
    expiration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'nonce',
  });
  return nonce;
};