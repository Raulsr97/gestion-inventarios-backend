const { Model, DataTypes } = require('sequelize')

const REMISION_RECOLECCION_TABLE = 'remisiones_recoleccion'

const RemisionRecoleccionSchema = {
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
  direccion_recoleccion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Cancelada', 'Confirmada'),
    allowNull: false,
    defaultValue: 'Pendiente',
  },
  remision_firmada: {
    type: DataTypes.STRING, // Guardará la URL del archivo PDF de la remisión firmada
    allowNull: true, // Se llena solo al confirmar entrega
  },
  observaciones_entrega: {
    type: DataTypes.TEXT,
    allowNull: true, // Puede llenarse al confirmar la entrega
  },
  usuario_creador: {
    type: DataTypes.STRING,
    allowNull: true, // Registra quién creó la remisión.
  },
  usuario_entrega: {
    type: DataTypes.STRING,
    allowNull: true, // Se llena cuando la remisión se marca como entregada.
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    allowNull: true, // Se llena cuando se confirma la entrega.
  },
  cancelada_por: {
    type: DataTypes.STRING,
    allowNull: true, // Registra quién canceló la remisión.
  },
  fecha_cancelacion: {
    type: DataTypes.DATE,
    allowNull: true, // Se llena cuando la remisión es cancelada.
  },
  fecha_programada: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  productos: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}

class RemisionRecoleccion extends Model {
  static associate(models) {
    this.belongsTo(models.Empresa, {foreignKey: 'empresa_id', as: 'empresa' })
    this.belongsTo(models.Cliente, {foreignKey: 'cliente_id', as: 'cliente'})
    this.belongsTo(models.Proyecto, {foreignKey: 'proyecto_id', as: 'proyecto'})
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REMISION_RECOLECCION_TABLE,
      modelName: 'RemisionRecoleccion',
      timestamps: false
    }
  }
}

module.exports = { RemisionRecoleccion, REMISION_RECOLECCION_TABLE, RemisionRecoleccionSchema}