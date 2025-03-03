'use strict';
const { DataTypes } = require('sequelize')
const { ACCESORIO_TABLE } = require('../src/models/Accesorio.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn(ACCESORIO_TABLE, 'descripcion')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn(ACCESORIO_TABLE, 'descripcion', {
      type: DataTypes.STRING,
      allowNull: false, 
    })
  }
};
