const { DataTypes, Model } = require('sequelize');

const IMPRESORA_TABLE = 'impresoras';

const ImpresoraSchema = {
    serie: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    marca_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'marcas', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('Nueva', 'Usada'),
        allowNull: false,
        defaultValue: 'Nueva'
    },
    tipo: {
        type: DataTypes.ENUM('Compra', 'Distribucion'),
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.ENUM('Almacen', 'Entregado', 'En Tránsito', 'Devuelto al proveedor'),
        allowNull: false,
        defaultValue: 'Almacen'
    },
    flujo: {  
        type: DataTypes.ENUM('Recolección', 'Distribución'),
        allowNull: true
    },
    origen_recoleccion: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    destino_distribucion: {
        type: DataTypes.STRING,
        allowNull: true
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
    },
    proyecto_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'proyectos', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    tiene_accesorios: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fecha_entrada: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_salida: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fecha_entrega_final: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'empresas', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'proveedores', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
};

class Impresora extends Model {
    static associate(models) {
        // Relación con clientes (si aplica)
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' })

        // Relación con proyectos (si aplica)
        this.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' })

        // Relacion con empresa (si aplica)
        this.belongsTo(models.Empresa, {foreignKey: 'empresa_id', as: 'empresa'})

        // Relacion con marcas
        this.belongsTo(models.Marca, { foreignKey: 'marca_id', as: 'marca' })

        // Relacion con proovedores
        this.belongsTo(models.Proveedor, {foreignKey: 'proveedor_id', as: 'proveedor'})

        // Relacion con remisiones a traves de la tabla intermedia
        this.belongsToMany(models.Remision, {
            through: 'remision_impresoras',
            foreignKey: 'serie',
            otherKey: 'numero_remision',
            as: 'remisiones'
        })

        this.hasMany(models.RemisionImpresora, {
            foreignKey: 'serie',
            as: 'relacion_impresoras'
          });
          

        this.belongsToMany(models.Accesorio, {
            through: 'impresora_accesorios',
            foreignKey: 'serie',
            otherKey: 'accesorio_id',
            as: 'accesorios'
        })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: IMPRESORA_TABLE,
            modelName: 'Impresora',
            timestamps: false
        };
    }
}

module.exports = { Impresora, ImpresoraSchema, IMPRESORA_TABLE };
