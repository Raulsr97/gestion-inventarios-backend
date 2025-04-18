'use strict';

const { DataTypes } = require('sequelize')
const { REFACCION_TABLE } = require('../src/models/Refaccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(REFACCION_TABLE, 'marca', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: 'marcas', 
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await queryInterface.addConstraint(REFACCION_TABLE, {
      fields: ['numero_parte'],
      type: 'unique',
      name: 'unique_numero_parte_refaccion'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REFACCION_TABLE, 'marca_id');
    await queryInterface.removeConstraint(REFACCION_TABLE, 'unique_numero_parte_refaccion');
  }
};
