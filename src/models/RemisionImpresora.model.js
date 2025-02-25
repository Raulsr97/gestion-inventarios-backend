const { Model, DataTypes} = require('sequelize')

const REMISION_IMPRESORA_TABLE = 'remision_impresoras'

const RemisionImpresoraSchema = {
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
      serie: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'impresoras',
          key: 'serie',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
}

class RemisionImpresora extends Model {
    static associate(models) {
        this.belongsTo(models.Remision, { foreignKey: 'numero_remision', as: 'remision' })
        this.belongsTo(models.Impresora, { foreignKey: 'serie', as: 'impresora' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: REMISION_IMPRESORA_TABLE,
            modelName: 'RemisionImpresora',
            timestamps: false,
        }
    }
}

module.exports = { RemisionImpresora, REMISION_IMPRESORA_TABLE, RemisionImpresoraSchema }
