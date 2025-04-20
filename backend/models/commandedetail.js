'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommandeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommandeDetail.belongsTo(models.Commande, { foreignKey: 'commandeId' });
      CommandeDetail.belongsTo(models.Kit, { foreignKey: 'kitId', as: 'kit' });

    }
  }
  CommandeDetail.init({
    commandeId: DataTypes.INTEGER,
    kitId: DataTypes.INTEGER,
    quantite: DataTypes.INTEGER,
    prixUnitaire: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'CommandeDetail',
  });
  return CommandeDetail;
};

