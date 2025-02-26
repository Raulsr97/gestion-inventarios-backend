const { DataTypes, Model } = require('sequelize')

const IMPRESORA_ACCESORIO_TABLE = 'impresora_accesorios'

const ImpresoraAccesorioSchema = {
    serie: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'impresoras',
            key: 'serie'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    accesorio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'accesorios',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}

class ImpresoraAccesorio extends Model {
    static associate(models) {
        this.belongsTo(models.Impresora, { foreignKey: 'serie', as: 'impresora' })
        this.belongsTo(models.Accesorio, { foreignKey: 'accesorio_id', as: 'accesorio' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: IMPRESORA_ACCESORIO_TABLE,
            modelName: 'ImpresoraAccesorio',
            timestamps: false
        }
    }
}

module.exports = { ImpresoraAccesorio, ImpresoraAccesorioSchema, IMPRESORA_ACCESORIO_TABLE }
