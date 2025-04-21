const { Model, DataTypes} = require('sequelize')

const REMISION_UNIDADIMG_TABLE = 'remision_unidadesimg'

const RemisionUnidadImgSchema = {
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
          model: 'unidades_imagen',
          key: 'serie',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
}

class RemisionUnidadImg extends Model {
    static associate(models) {
        this.belongsTo(models.Remision, { foreignKey: 'numero_remision', as: 'remision' })
        this.belongsTo(models.UnidadImagen, { foreignKey: 'serie', as: 'unidadimg' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: REMISION_UNIDADIMG_TABLE,
            modelName: 'RemisionUnidadImg',
            timestamps: false,
        }
    }
}

module.exports = { RemisionUnidadImg, REMISION_UNIDADIMG_TABLE, RemisionUnidadImgSchema }

