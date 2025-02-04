const { models } = require('../config/db')

class ClienteService {
    async obtenerClientes() {
        return await models.Cliente.findAll();
    }

    async crearCliente(data) {
        return await models.Cliente.create(data);
    }
}

module.exports = new ClienteService();
