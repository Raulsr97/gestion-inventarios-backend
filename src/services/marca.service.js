const { models } = require('../config/db')

class MarcaService {
    async obtenerMarcas() {
        return await models.Marca.findAll();
    }

    async crearMarca(data) {
        const { nombre } = data

        // Busca si la marca ya existe
        let marca = await models.Marca.findOne({where : { nombre }})

        if (!marca) {
            // Si la marca no existe la creamos
            marca = await models.Marca.create({ nombre });
        }

        return marca 
    }
}

module.exports = new MarcaService();
