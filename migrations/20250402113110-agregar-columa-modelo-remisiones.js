'use strict';
const { DataTypes} = require('sequelize')
const { REMISION_TABLE } = require('../src/models/Remision.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(REMISION_TABLE, 'fecha_programada', {
      type: DataTypes.DATE,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REMISION_TABLE, 'fecha_programada')
  }
};
