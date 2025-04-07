'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Panier.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
       Panier.belongsTo(models.Kit, {
        foreignKey: 'kitId',
        as: 'kit',
      });
    }
  }
  Panier.init({
    userId: DataTypes.INTEGER,
    kitId: DataTypes.INTEGER,
    quantite: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Panier',
  });
  return Panier;
};
