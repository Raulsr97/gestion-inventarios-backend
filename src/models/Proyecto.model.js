const { DataTypes, Model } = require('sequelize');

const PROYECTO_TABLE = 'proyectos';

const ProyectoSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clientes', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
};

class Proyecto extends Model {
    static associate(models) {
        this.hasMany(models.Impresora, { foreignKey: 'proyecto_id', as: 'impresoras' })
        this.hasMany(models.Remision, {foreignKey: 'proyecto_id', as: 'remisiones'})
        this.hasMany(models.RemisionRecoleccion, {foreignKey: 'proyecto_id', as: 'remisiones_recoleccion'})
        this.hasMany(models.Toner, { foreignKey: 'proyecto_id', as: 'toners'})
        this.hasMany(models.UnidadImagen, { foreignKey: 'proyecto_id', as: 'unidades_imagen'})

        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PROYECTO_TABLE,
            modelName: 'Proyecto',
            timestamps: false
        };
    }
}

module.exports = { Proyecto, ProyectoSchema, PROYECTO_TABLE };
