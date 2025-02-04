'use strict';

const { TONER_TABLE, TonerSchema } = require('../src/models/Toner.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(TONER_TABLE, TonerSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(TONER_TABLE)
  }
};

