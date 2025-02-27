const { Model, DataTypes} = require('sequelize')
const { Refaccion } = require('./Refaccion.model')

const REMISION_REFACCION_TABLE = 'remision_refacciones'

const RemisionRefaccionSchema = {
    numero_remision: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'remisiones',
          key: 'numero_remision',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      refaccion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'refacciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}

class RemisionRefaccion extends Model {
    static associate(models) {
        this.belongsTo(models.Remision, { foreignKey: 'numero_remision', as: 'remision' })
        this.belongsTo(models.Impresora, { foreignKey: 'refaccion_id', as: 'refaccion' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: REMISION_REFACCION_TABLE,
            modelName: 'RemisionRefaccion',
            timestamps: false,
        }
    }
}

module.exports = { RemisionRefaccion, REMISION_REFACCION_TABLE, RemisionRefaccionSchema }
