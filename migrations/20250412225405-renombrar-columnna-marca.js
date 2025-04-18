'use strict';

const { REFACCION_TABLE } = require('../src/models/Refaccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(REFACCION_TABLE, 'marca', 'marca_id')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(REFACCION_TABLE, 'marca_id', 'marca')
  }
};
