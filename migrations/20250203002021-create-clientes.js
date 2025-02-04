'use strict';

const { CLIENTE_TABLE, ClienteSchema } = require('../src/models/Cliente.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(CLIENTE_TABLE, ClienteSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(CLIENTE_TABLE)
  }
};
