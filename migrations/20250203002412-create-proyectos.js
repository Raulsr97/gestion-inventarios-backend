'use strict';

const { PROYECTO_TABLE, ProyectoSchema } = require('../src/models/Proyecto.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(PROYECTO_TABLE, ProyectoSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(PROYECTO_TABLE)
  }
};
