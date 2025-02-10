'use strict';

const {MARCA_TABLE, MarcaSchema } = require('../src/models/Marca.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(MARCA_TABLE, MarcaSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(MARCA_TABLE)
  }
};
