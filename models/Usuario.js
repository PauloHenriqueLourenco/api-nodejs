const Sequelize = require('sequelize');
const db = require('../config/pg_connection')

const Usuario = db.define('usuario', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.STRING
    },
    data_nascimento: {
        type: Sequelize.DATE
    },
    cpf: {
        type: Sequelize.STRING
    }, 
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'usuario'
    }
)

module.exports = Usuario;