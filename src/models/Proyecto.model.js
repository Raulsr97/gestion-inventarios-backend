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
    }
};

class Proyecto extends Model {
    static associate(models) {
        this.hasMany(models.Impresora, { foreignKey: 'proyecto_id', as: 'impresoras' })
        this.hasMany(models.Remision, {foreignKey: 'proyecto_id', as: 'remisiones'})

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
