const { models } = require('../config/db');

class ProyectoService {
    async obtenerProyectos() {
        return await models.Proyecto.findAll({
            include: { model: models.Cliente, as: 'cliente', attributes: ['nombre']}
        });
    }

    async crearProyecto(data) {
        const { nombre, cliente_id } = data

        if (!cliente_id) {
            throw new Error('Debe especificar un cliente para el proyecto')
        }

        // Buscar si el proyecto ya existe
        let proyecto = await models.Proyecto.findOne({ where: { nombre }})

        if (!proyecto) {
            // Si no existe lo creamos
            proyecto = await models.Proyecto.create({ 
                nombre,
                cliente_id 
            })
        }

        return proyecto
    }
}

module.exports = new ProyectoService();
