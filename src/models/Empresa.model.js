const { DataTypes, Model} = require('sequelize')

const EMPRESA_TABLE = 'empresas'

const EmpresaSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    } 
}

class Empresa extends Model {
    static associate(models) {
      this.hasMany(models.Impresora, {foreignKey: 'empresa_id',  as: 'impresoras' })
      this.hasMany(models.Remision, {foreignKey: 'empresa_id', as: 'remisiones'})
    }

    static config(sequelize) {
        return{
            sequelize,
            tableName: EMPRESA_TABLE,
            modelName: 'Empresa',
            timestamps: false
        }
    }
}

module.exports = { Empresa, EMPRESA_TABLE, EmpresaSchema}