'use strict';

const { Client } = require('pg');
const urlConexao = require('../../config/pg_connection');

module.exports = {
    cadastrar_endereco: cadastrarEndereco,
    listar_enderecos_usuario: listarEnderecosUsuario,
    listar_enderecos: listarEnderecos
};

async function cadastrarEndereco(req, res) {
    const rua = req.body.rua.trim();
    const numero = req.body.numero || null;
    const complemento = req.body.complemento || null;
    const bairro = req.body.bairro;
    const usuario_id = req.body.usuario_id;

    try {
        const client = new Client({ connectionString: urlConexao });
        await client.connect();

        await client.query('INSERT INTO endereco (rua, numero, complemento, bairro, usuario_id) VALUES ($1, $2, $3, $4, $5)', [rua, numero, complemento, bairro, usuario_id]);
        await client.end();

        res.status(201).json({ mensagem: 'Endereço cadastrado com sucesso!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}

async function listarEnderecosUsuario(req, res) {
    const usuario_id = req.swagger.params.usuario_id.value;

    try {
        const client = new Client({ connectionString: urlConexao });
        await client.connect();

        await client.query('SELECT rua, numero, complemento, bairro FROM endereco WHERE usuario_id = $1', [usuario_id], function (err, result) {
            if (err) {
                return console.error(err);
            }
            var enderecos = [];

            result.rows.forEach(function (endereco) {
                var rua = endereco.rua;
                var numero = endereco.numero == null ? 's/n' : endereco.numero;
                var complemento = endereco.complemento != null ? ' - ' + endereco.complemento : '';
                var bairro = endereco.bairro;

                enderecos.push({
                    'endereco': rua + ', ' + numero + complemento,
                    'bairro': bairro
                });
            })

            const lista = {
                'total': result.rows.length,
                'enderecos': enderecos
            }

            res.status(200).json(lista);
        });
        await client.end();

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}

async function listarEnderecos(req, res) {
    var query = '';

    if (typeof req.query.bairro == 'undefined')
        query = 'SELECT * FROM endereco';
    else
        query = `SELECT * FROM endereco WHERE bairro ILIKE '${req.query.bairro}'`;

    try {
        const client = new Client({ connectionString: urlConexao });
        await client.connect();

        await client.query(query, function (err, result) {
            if (err) {
                return console.error(err);
            }
            res.status(200).json(result.rows);
        });
        await client.end();

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}