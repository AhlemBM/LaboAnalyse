'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rendezvous', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numTel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      adresse: {
        type: Sequelize.STRING,
        allowNull: false
      },
      testId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Tests",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      dateHeure: {
        type: Sequelize.DATE
      },
      statut: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      lieu: {  // Ajout du champ lieu
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['domicile', 'labo']] // Limiter aux valeurs "domicile" ou "labo"
        }
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
    await queryInterface.dropTable('Rendezvous');
  }
};
