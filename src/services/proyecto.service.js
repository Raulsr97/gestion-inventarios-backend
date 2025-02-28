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

        const nuevoProyecto = await models.Proyecto.create({ 
            nombre, 
            cliente_id
        })
        return nuevoProyecto
    }
}

module.exports = new ProyectoService();
