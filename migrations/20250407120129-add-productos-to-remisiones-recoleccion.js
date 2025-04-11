'use strict';

const { REMISION_RECOLECCION_TABLE } = require('../src/models/RemisionRecoleccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(REMISION_RECOLECCION_TABLE, 'productos', {
      type: Sequelize.JSON,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REMISION_RECOLECCION_TABLE, 'productos')
  }
};
