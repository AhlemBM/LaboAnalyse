'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.hasMany(models.Resultat, { foreignKey: "testId" });
    }
  }
  Test.init({
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    prix: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Test',
  });
  return Test;
};
