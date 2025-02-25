const { Model, DataTypes} = require('sequelize')

const REMISION_TONER_TABLE = 'remision_toners'

const RemisionTonerSchema = {
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
          model: 'toners',
          key: 'serie',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
}

class RemisionToner extends Model {
    static associate(models) {
        this.belongsTo(models.Remision, { foreignKey: 'numero_remision', as: 'remision' })
        this.belongsTo(models.Impresora, { foreignKey: 'serie', as: 'toner' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: REMISION_TONER_TABLE,
            modelName: 'RemisionToner',
            timestamps: false,
        }
    }
}

module.exports = { RemisionToner, REMISION_TONER_TABLE, RemisionTonerSchema }
