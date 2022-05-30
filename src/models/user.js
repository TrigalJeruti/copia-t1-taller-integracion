
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    psu_score: DataTypes.INTEGER,
    university: DataTypes.STRING,
    gpa_score: DataTypes.FLOAT,
    job: DataTypes.STRING,
    salary: DataTypes.FLOAT,
    promotion: DataTypes.BOOLEAN,
    hospital: DataTypes.STRING,
    operations:DataTypes.ARRAY(DataTypes.TEXT),
    medical_debt: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};