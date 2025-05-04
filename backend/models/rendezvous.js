'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rendezvous extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rendezvous.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Rendezvous.belongsTo(models.Test, {
        foreignKey: 'testId',
        as: 'test',
      });
    }
  }
  Rendezvous.init({
   // patientId: DataTypes.INTEGER,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    lieu: DataTypes.STRING,
    numTel: DataTypes.STRING,
testId: DataTypes.INTEGER,
    dateHeure: DataTypes.DATE,
    statut: DataTypes.STRING,
    notes: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rendezvous',
  });
  return Rendezvous;
};
