'use strict';

const { PROYECTO_TABLE } = require('../src/models/Proyecto.model');
const { DataTypes} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PROYECTO_TABLE, 'cliente_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(PROYECTO_TABLE, 'cliente_id')
  }
};
