const { models } = require('../config/db')

class ClienteService {
    async obtenerClientes() {
        return await models.Cliente.findAll();
    }

    async crearCliente(data) {
        const { nombre } = data
        
        // Buscar si el cliente ya existe
        let cliente = await models.Cliente.findOne({ where: { nombre }})

        if (!cliente) {
            // Si no existe lo creamos
            cliente = await models.Cliente.create({ nombre })
        }

        return cliente
    }
}

module.exports = new ClienteService();
