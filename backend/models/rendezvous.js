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
        foreignKey: 'patientId',
        as: 'patient',
      });
    }
  }
  Rendezvous.init({
    patientId: DataTypes.INTEGER,

    dateHeure: DataTypes.DATE,
    statut: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rendezvous',
  });
  return Rendezvous;
};
