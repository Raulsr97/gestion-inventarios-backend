'use strict';

const { REFACCION_TABLE } = require('../src/models/Refaccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(REFACCION_TABLE, 'unique_numero_parte_refaccion')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addConstraint(REFACCION_TABLE, {
      fields: ['numero_parte'],
      type: 'unique',
      name: 'unique_numero_parte_refaccion'
    })
  }
};
