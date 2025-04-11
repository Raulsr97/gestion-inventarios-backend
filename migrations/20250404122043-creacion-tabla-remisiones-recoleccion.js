'use strict';

const { REMISION_RECOLECCION_TABLE, RemisionRecoleccionSchema } = require('../src/models/RemisionRecoleccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(REMISION_RECOLECCION_TABLE, RemisionRecoleccionSchema)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(REMISION_RECOLECCION_TABLE)
  }
};
