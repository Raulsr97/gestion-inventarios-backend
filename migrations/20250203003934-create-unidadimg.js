'use strict';

const { UNIDAD_IMAGEN_TABLE, UnidadImagenSchema } = require('../src/models/UnidadImagen.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(UNIDAD_IMAGEN_TABLE, UnidadImagenSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(UNIDAD_IMAGEN_TABLE)
  }
};

