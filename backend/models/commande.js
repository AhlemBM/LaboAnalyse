'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Commande.belongsTo(models.User, { foreignKey: 'userId' });
      Commande.hasMany(models.CommandeDetail, { foreignKey: 'commandeId' });
    }
  }
  Commande.init({
    userId: DataTypes.INTEGER,
    adresse: DataTypes.STRING,
    dateCommande: DataTypes.DATE,
    statut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Commande',
  });
  return Commande;
};
