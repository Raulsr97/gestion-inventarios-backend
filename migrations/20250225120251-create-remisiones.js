'use strict';

const { REMISION_TABLE, RemisionSchema } = require('../src/models/Remision.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(REMISION_TABLE, RemisionSchema)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(REMISION_TABLE)
  }
};
