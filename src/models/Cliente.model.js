const { DataTypes, Model } = require('sequelize');

const CLIENTE_TABLE = 'clientes';

const ClienteSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

class Cliente extends Model {
    static associate(models) {
        this.hasMany(models.Impresora, { foreignKey: 'cliente_id', as: 'impresoras' })
        this.hasMany(models.Remision, {foreignKey: 'cliente_id', as: 'remisiones'})
        this.hasMany(models.Toner, { foreignKey: 'cliente_id', as: 'toners'})
        this.hasMany(models.UnidadImagen, { foreignKey: 'cliente_id', as: 'unidadesimg'})
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: CLIENTE_TABLE,
            modelName: 'Cliente',
            timestamps: false
        };
    }
}

module.exports = { Cliente, ClienteSchema, CLIENTE_TABLE };
