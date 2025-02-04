'use strict';

const { IMPRESORA_TABLE, ImpresoraSchema } = require('../src/models/Impresora.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(IMPRESORA_TABLE, ImpresoraSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(IMPRESORA_TABLE)
  }
};
