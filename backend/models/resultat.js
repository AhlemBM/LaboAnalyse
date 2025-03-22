'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resultat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Resultat.belongsTo(models.User, { foreignKey: "patientId", as: "patient" });
      Resultat.belongsTo(models.Test, { foreignKey: "testId", as: "test" });
    }
  }
  Resultat.init({
    patientId: DataTypes.INTEGER,
    testId: DataTypes.INTEGER,
    analyse: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Resultat',
  });
  return Resultat;
};
