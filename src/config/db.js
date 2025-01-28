const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')
dotenv.config() // Cargar las variables del archivo .env

const setupModels = require('../models')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log
})

sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully!')
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err)
      })


setupModels(sequelize)
      
module.exports = sequelize 