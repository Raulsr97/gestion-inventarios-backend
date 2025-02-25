'use strict';

const { REMISION_IMPRESORA_TABLE, RemisionImpresoraSchema } = require('../src/models/RemisionImpresora.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(REMISION_IMPRESORA_TABLE, RemisionImpresoraSchema)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(REMISION_IMPRESORA_TABLE)
  }
};
