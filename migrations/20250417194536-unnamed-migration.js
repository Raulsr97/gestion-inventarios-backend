'use strict';

const { UNIDAD_IMAGEN_TABLE } = require('../src/models/UnidadImagen.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(UNIDAD_IMAGEN_TABLE, 'fecha_ingreso', 'fecha_entrada')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(UNIDAD_IMAGEN_TABLE, 'fecha_entrada', 'fecha_ingreso')

  }
};
