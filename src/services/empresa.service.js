const { models } = require('../config/db');

class EmpresaService {
    async obtenerEmpresas() {
        try {
            const empresas = await models.Empresa.findAll();
            return empresas;
        } catch (error) {
            throw new Error("Error al obtener empresas");
        }
    }
}

module.exports = new EmpresaService();