const { Model, DataTypes } = require('sequelize')

const REMISION_TABLE = 'remisiones'

const RemisionSchema = {
    numero_remision: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "empresas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      fecha_emision: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "clientes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      proyecto_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "proyectos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      destinatario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion_entrega: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      notas: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
}

class Remision extends Model {
  static associate(models) {
    this.belongsTo(models.Empresa, {foreignKey: 'empresa_id', as: 'empresa' })
    this.belongsTo(models.Cliente, {foreignKey: 'cliente_id', as: 'cliente'})
    this.belongsTo(models.Proyecto, {foreignKey: 'proyecto_id', as: 'proyecto'})

    this.belongsToMany(models.Impresora, {
      through: 'remision_impresoras',
      foreignKey: 'numero_remision',
      otherKey: 'serie',
      as: 'impresoras'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REMISION_TABLE,
      modelName: 'Remision',
      timestamps: false
    }
  }
}

module.exports = { Remision, REMISION_TABLE, RemisionSchema}