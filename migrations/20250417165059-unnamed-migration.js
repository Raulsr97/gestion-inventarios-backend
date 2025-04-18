'use strict';

const { TONER_TABLE } = require('../src/models/Toner.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(TONER_TABLE, 'fecha_ingreso', 'fecha_entrada')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(TONER_TABLE, 'fecha_entrada', 'fecha_ingreso');
  }
};
