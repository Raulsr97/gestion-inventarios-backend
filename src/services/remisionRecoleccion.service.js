const { models, sequelize } = require('../config/db')

class RemisionRecoleccionService {
  async crearRemision(data) {
    const { numero_remision, empresa_id, cliente_id, proyecto_id, destinatario, direccion_recoleccion, notas, productos, fecha_programada, usuario_creador } = data;

    const transaction = await sequelize.transaction()

    console.log("📦 Datos recibidos para crear remisión:", data)

    try {
      const fecha_programada_obj = fecha_programada ? new Date(`${fecha_programada}T00:00:00Z`) : null

      // Crear la remision con la transaccion
      const nuevaRemision = await models.RemisionRecoleccion.create({
        numero_remision,
        empresa_id,
        cliente_id,
        proyecto_id,
        destinatario,
        direccion_recoleccion,
        notas,
        productos,
        fecha_emision: new Date(), // ✅ se genera automáticamente
        fecha_programada: fecha_programada_obj,
        usuario_creador
      }, { transaction })

      await transaction.commit()
      return nuevaRemision

    } catch (error) {
       // Si algo falla, revertimos los cambios
       await transaction.rollback();
       throw new Error('Error al crear la remisión: ' + error.message);
    }
  }

  async obtenerRemisionPorNumero(numero_remision) {
    try {
      const remision = await models.RemisionRecoleccion.findOne({
          where: { numero_remision },
          include: [
              { model: models.Cliente, as: "cliente" },
              { model: models.Proyecto, as: "proyecto" },
              { model: models.Empresa, as: "empresa" },
          ]
      });

      if (!remision) {
          throw new Error("No se encontró la remisión.");
      }

      return remision;
  } catch (error) {
      console.error("❌ Error al obtener la remisión:", error.message);
      throw new Error("Error al obtener la remisión.");
  }
  }

  async cancelarRemision(numero_remision, usuario_cancelacion) {
    const transaction = await sequelize.transaction()

    try {
      const remisionRecoleccion = await models.RemisionRecoleccion.findByPk(numero_remision, { transaction })

      if (!remisionRecoleccion) {
        throw new Error('La remisión no exixte')
      }

      if (remisionRecoleccion.estado != 'Pendiente') {
        throw new Error('Solo se pueden cancelar remisiones en estado Pendiente')
      }

      await remisionRecoleccion.update(
        {
          estado: 'Cancelada',
          cancelada_por: usuario_cancelacion,
          fecha_cancelacion: new Date()
        },
        { transaction }
      )

      await transaction.commit();
      return { mensaje: 'Remisión cancelada con éxito' };
    
    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al cancelar la remisión: ' + error.message);
    }
  }

  async confirmarEntregaRemision(numero_remision, usuario_entrega, remision_firmada) {
    const transaction = await sequelize.transaction()

    try {
      const remisionRecoleccion = await models.RemisionRecoleccion.findByPk(numero_remision, { transaction })

      if (!remisionRecoleccion) {
        throw new Error('La remisión no existe')
      }

      if (remisionRecoleccion.estado != 'Pendiente') {
        throw new Error('Solo se pueden confirmar remisiones en estado Pendiente')
      }

      if (!remision_firmada) {
        throw new Error('Se requiere el archivo de remisión firmada para confirmar.');
      }

      await remisionRecoleccion.update(
        {
          estado: 'Confirmada',
          usuario_entrega,
          fecha_entrega: new Date(),
          remision_firmada
        },
        { transaction }
      )

      await transaction.commit()
      return { mensaje: 'Remision confirmada con exito'}

    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al confirmar la remisión: ' + error.message);
    }
  }

  async buscarRemisiones(filtros = {}) {
    const { numero_remision, empresa_id, cliente_id, proyecto_id, estado } = filtros

    // Construccion de filtros dinamicos
    const whereClause = {}
      if (numero_remision) whereClause.numero_remision = numero_remision
      if (empresa_id) whereClause.empresa_id = empresa_id
      if (cliente_id) whereClause.cliente_id = cliente_id
      if (proyecto_id) whereClause.proyecto_id = proyecto_id
      if (estado) whereClause.estado = estado

    // Consultamos las remisiones en base a los filtros aplicados
    const remisionesRecoleccion = await models.RemisionRecoleccion.findAll({
      where: whereClause,
      include: [
      {
        model: models.Empresa,
        as: 'empresa',
        attributes: ['id', 'nombre']
      },
      {
        model: models.Cliente,
        as: 'cliente',
        attributes: ['id', 'nombre']
      },
      {
        model: models.Proyecto,
        as: 'proyecto',
        attributes: ['id', 'nombre']
      }
      ],
      order: [['fecha_emision', 'DESC']]
    })

    return remisionesRecoleccion
  }

  async obtenerTodasLasRemisiones() {
    try {
      const remisionesRecoleccion = await models.RemisionRecoleccion.findAll({
        include: [
          { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre']},
          { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre']}
        ],
        order: [['fecha_emision', 'DESC']]
      })

      return remisionesRecoleccion
    } catch (error) {
      console.error("❌ Error al obtener las remisiones:", error);
      throw new Error("Error al obtener las remisiones");
    }
  }

  async subirEvidencia(numero_remision, nombreArchivo) {
    try {
      const remisionRecoleccion = await models.RemisionRecoleccion.findOne({ where: { numero_remision }})

      if (!remisionRecoleccion) {
        throw new Error('Remision no encontrada')
      }

      // Actualizar la remision con el archivo y estado confirmado
      remisionRecoleccion.remision_firmada = nombreArchivo
      remisionRecoleccion.estado = 'Confirmada'
      remisionRecoleccion.fecha_entrega = new Date()
      remisionRecoleccion.usuario_entrega = 'admin'

      await remisionRecoleccion.save()

      return remisionRecoleccion
    } catch (error) {
      console.error("❌ Error al subir evidencia:", error.message)
      throw new Error("No se pudo actualizar la remisión con la evidencia")
    }
  }
}

module.exports = new RemisionRecoleccionService()