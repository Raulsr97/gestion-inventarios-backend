'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('productos', 'numero_serie', 'serie')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('productos', 'serie', 'numero_serie')
  }
};
