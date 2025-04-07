'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kit.hasMany(models.Panier, { foreignKey: "kitId" });
      Kit.hasMany(models.CommandeDetail, { foreignKey: "kitId" });

    }
  }
  Kit.init({
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    prix: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kit',
  });
  return Kit;
};
