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

    async crearEmpresa(data) {
        const { nombre } = data

        let empresa = await models.Empresa.create({ nombre })
        return empresa
    }
}

module.exports = new EmpresaService();