'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CommandeDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      commandeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Commandes",
          key: "id",
        }
      },
      kitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Kits",
          key: "id",}
      },
      quantite: {
        type: Sequelize.INTEGER
      },
      prixUnitaire: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CommandeDetails');
  }
};
