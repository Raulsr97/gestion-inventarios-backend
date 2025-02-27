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
            },
            {
              model: models.Proveedor,
              as: 'proveedor',
              attributes: ['nombre']
            }
          ]
        });
    }

    async crearImpresora(data) {
        return await models.Impresora.create(data);
    }

    async registrarLote(data) {
      try {
        const { modelo, marca_id, estado, tipo, ubicacion, cliente_id, proyecto_id, proveedor_id, tiene_accesorios, series } = data;

        if (proyecto_id) {
          let proyectoExistente = await models.Proyecto.findOne({ where: { id: proyecto_id }})

          if (!proyectoExistente) {
            proyectoExistente = await models.Proyecto.create({
              id: proyecto_id,
              nombre: data.proyecto_nombre,
              cliente_id: cliente_id
            })
          }

          data.proyecto_id = proyectoExistente.id // Asegurar que el id es correcto
        }

        if (proveedor_id) {
          let proveedorExistente = await models.Proveedor.findOne({ where: { id: proveedor_id } });
      
          if (!proveedorExistente) {
              proveedorExistente = await models.Proveedor.create({
                  nombre: data.proveedor_nombre 
              });
          }
      
          data.proveedor_id = proveedorExistente.id; // Asegurar que el ID es correcto
        }

        if (marca_id) {
          let marcaExistente = await models.Marca.findOne({ where: { id: marca_id } });
      
          if (!marcaExistente) {
              marcaExistente = await models.Marca.create({ nombre: data.marca_nombre });
          }
      
          data.marca_id = marcaExistente.id; // Asegurar que el ID es correcto
        }
        
        if (cliente_id) {
            let clienteExistente = await models.Cliente.findOne({ where: { id: cliente_id } });
        
            if (!clienteExistente) {
                clienteExistente = await models.Cliente.create({ nombre: data.cliente_nombre });
            }
        
            data.cliente_id = clienteExistente.id; // Asegurar que el ID es correcto
        }

        // Validacion de que proyecto tenga un cliente asociado
        if (proyecto_id && !cliente_id) {
          throw new Error('Si se asigna un proyecto, tambien se debe asignar un cliente.')
        }

        // Verificacion de series ya existente en la base de datos
        const existentes = await models.Impresora.findAll({
          where: { serie: series }
        })

        if (existentes.length > 0) {
          const seriesExistentes = existentes.map(impresora => impresora.serie).join(', ')
          throw new Error(`Las siguientes series ya estan registradas ${seriesExistentes}`)
        }
      

        // Creación de impresoras en la base de datos
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
          fecha_entrada: new Date(),
          proveedor_id: proveedor_id || null
        }));

        console.log("Datos recibidos para registrar impresoras:", data);
        console.log("Valor de tipo recibido:", data.tipo);

        await models.Impresora.bulkCreate(impresoras);

        return {
          mensaje: "Impresoras registradas exitosamente",
          total: series.length
        };

      } catch (error) {
        console.error("Error al registrar lote de impresoras:", error.message);
        throw new Error("Hubo un problema al registrar las impresoras. " + error.message);
      }
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
