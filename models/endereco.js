const Sequelize = require('sequelize');
const db = require('../config/pg_connection')

const Endereco = db.define('endereco', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    rua: {
        type: Sequelize.STRING
    },
    numero: {
        type: Sequelize.INTEGER
    },
    complemento: {
        type: Sequelize.STRING
    },
    bairro: {
        type: Sequelize.STRING
    },
    usuario_id: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'endereco'
    }
)

module.exports = Endereco;