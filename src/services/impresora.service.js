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
      const { 
          modelo, 
          estado, 
          tipo, 
          ubicacion, 
          tiene_accesorios, 
          series, 
          marca_id,
          cliente_id, 
          proyecto_id, 
          proveedor_id
      } = data;
  
       // 🔍 Buscar o crear la marca antes de registrar la impresora
      let marca = null;
      if (marca_id) {
          marca = await models.Marca.findOne({ where: { id: marca_id } });
          if (!marca) {
              throw new Error('La marca seleccionada no existe.');
          }
      }
  
      // 🔍 Verificar si el cliente existe o crearlo
      let cliente = null;
      if (cliente_id) {
          cliente = await models.Cliente.findOne({ where: { id: cliente_id } });
          if (!cliente) {
              throw new Error('El cliente seleccionado no existe.');
          }
      }
  
      // Si se proporciona un nuevo proyecto, primero lo registramos
      let proyectoId = proyecto_id;
      if (proyecto_id === "nuevo" && data.nuevoProyecto) {
        if (!cliente_id) {
            throw new Error("No se puede registrar un proyecto sin un cliente asociado.");
        }

        const [proyecto, created] = await models.Proyecto.findOrCreate({
            where: { nombre: data.nuevoProyecto, cliente_id },
            defaults: { nombre: data.nuevoProyecto, cliente_id }
        });

        proyectoId = proyecto.id; // ✅ Guardamos el ID del nuevo proyecto
    }
  
      // 🟢 Verificamos si el Proveedor existe o lo creamos
      let proveedor = null;
      if (proveedor_id) {
        proveedor = await models.Proveedor.findOne({ where: { id: proveedor_id } });
        if (!proveedor) {
            throw new Error('El proveedor seleccionado no existe.');
        }
    }
  
      // 🟢 Ahora que tenemos todos los IDs, registramos las impresoras
      const impresoras = series.map(serie => ({
          serie,
          modelo,
          marca_id: marca ? marca.id : null,
          estado: estado || 'Nueva',
          tipo,
          ubicacion: ubicacion || 'Almacén',
          cliente_id: cliente ? cliente.id : null,
          proyecto_id: proyectoId || null,
          tiene_accesorios: tiene_accesorios || false,
          fecha_entrada: new Date(),
          proveedor_id: proveedor ? proveedor.id : null
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
