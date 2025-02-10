module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('impresoras', 'marca_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'marcas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });

    await queryInterface.addColumn('toners', 'marca_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'marcas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });

    await queryInterface.addColumn('unidades_imagen', 'marca_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'marcas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('impresoras', 'marca_id');
    await queryInterface.removeColumn('toners', 'marca_id');
    await queryInterface.removeColumn('unidades_imagen', 'marca_id');
  }
};

