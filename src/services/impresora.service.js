const { Sequelize } = require('sequelize');
const { models } = require('../config/db');

class ImpresoraService {
    async obtenerImpresoras() {
        return await models.Impresora.findAll();
    }

    async crearImpresora(data) {
        return await models.Impresora.create(data);
    }

    async registrarLote(data) {
        const { modelo, marca_id, estado, tipo, ubicacion, cliente_id, proyecto_id, tiene_accesorios, series } = data;

        const impresoras = series.map(serie => ({
            serie,
            modelo,
            marca_id: marca_id || null,
            estado: estado || 'Nueva',
            tipo,
            ubicacion: ubicacion || 'Almacén',
            cliente_id: cliente_id || null,
            proyecto_id: proyecto_id || null,
            tiene_accesorios: tiene_accesorios || false,
            fecha_entrada: new Date()
        }));

        await models.Impresora.bulkCreate(impresoras);

        return {
            mensaje: "Impresoras registradas exitosamente",
            total: series.length
        };
    }

    async contarPorProyecto() {
        const resultados = await models.Impresora.findAll({
            // Definimos que informacion queremos
            attributes: [
                'proyecto_id', // Saber a que proyecto pertenece cada impresora
                // Contamos cuantas impresoras hay agrupadas por proyecto id
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad']
            ],
            where: { ubicacion: 'Almacén' }, // Solo impresoras en almacen
            group: ['proyecto_id'], // Agrupamos las impresoras segun su proyecto
            // Relacionar con la tabla proyectos
            include: [
                {
                    model: models.Proyecto,
                    as: 'proyecto',
                    attributes: ['nombre'] // Obtener el nombre del proyecto
                }
            ]
        })

        return resultados
            .filter(item => item.proyecto) // Excluir los que no tienen proyecto    
            .map(item => ({
                proyecto: item.proyecto.nombre,
                cantidad: item.getDataValue('cantidad')
            })
        )
    }
}

module.exports = new ImpresoraService();
