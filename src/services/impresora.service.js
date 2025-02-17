const { Sequelize, Op } = require('sequelize');
const { models } = require('../config/db');

class ImpresoraService {
    async obtenerImpresoras() {
        return await models.Impresora.findAll({
          include: [
            {
              model: models.Marca,
              as: 'marca',
              attributes: ['nombre']
            },
            {
              model: models.Cliente,
              as: 'cliente',
              attributes: ['nombre']
            },
            {
              model: models.Proyecto,
              as: 'proyecto',
              attributes: ['nombre']
            }
          ]
        });
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

    async contarPorCliente () {
      const resultados = await models.Impresora.findAll({
        attributes: [
          'cliente_id', 
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad']
        ],
        where: { ubicacion: 'Almacén'},
        group: ['cliente_id'],
        include: [
          {
            model: models.Cliente,
            as: 'cliente',
            attributes: ['nombre']
          }
        ]
      })

      return resultados
        .filter(item => item.cliente)
        .map(item => ({
        cliente: item.cliente.nombre,
        cantidad: item.getDataValue('cantidad')
        }))
    }

    async obtenerMovimientosdelMes() {
      const ahora = new Date() // Obtenemos la fecha actual
      const mesActual = ahora.getMonth() + 1 // Los meses en Javascript van de 0 a 11, sumamos 1 para obtener el mes corecto
      const anioActual = ahora.getFullYear() // Obtenemos el año actual

      // Filtrar impresoras con fecha de entrada en este mes
      const entradas = await models.Impresora.count({
        where: {
          fecha_entrada: {
            [Op.gte]: new Date(anioActual, mesActual -1, 1), // Desde el 1 del mes actual
            [Op.lt]: new Date(anioActual, mesActual, 1) // Hasta el 1 del siguiente mes
          }
        }
      })

      // Filtar impresoras con fecha de salida en este mes
      const salidas = await models.Impresora.count({
        where: {
          fecha_salida: {
            [Op.gte]: new Date(anioActual, mesActual - 1, 1),
            [Op.lt]: new Date(anioActual, mesActual, 1)
          }
        }
      })

      return { entradas, salidas }
    }

}

module.exports = new ImpresoraService();
