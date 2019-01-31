'use strict';

const { Client } = require('pg');
const urlConexao = require('../../config/pg_connection');
const validador_cpf = require('@fnando/cpf/dist/node');

module.exports = {
    cadastrar_usuario: cadastrarUsuario,
    editar_usuario: editarUsuario,
    buscar_usuario: buscarUsuario,
    listar_usuarios: listarUsuarios
};

async function cadastrarUsuario(req, res) {
    const nome = req.body.nome.trim();
    const data_nascimento = req.body.data_nascimento;
    const cpf = validador_cpf.strip(req.body.cpf); // retirado as pontuações do CPF

    try {
        const client = new Client({ connectionString: urlConexao });
        var cadastrado = false;

        await client.connect();

        // Validando o CPF
        if (validador_cpf.isValid(cpf)) {

            // Verificando se o usuário já está no banco de dados (CPF deve ser único)
            await client.query('SELECT * FROM usuario WHERE cpf = $1', [cpf], function (err, result) {
                if (err) {
                    return console.error(err);
                }

                if (result.rows.length > 0) {
                    cadastrado = true;
                }
            });

            if (cadastrado) {
                res.status(400).json({ mensagem: 'CPF informado já está cadastrado' })
            }
            else {
                await client.query('INSERT INTO usuario (nome, data_nascimento, cpf) VALUES ($1, $2, $3)', [nome, data_nascimento, cpf]);
                await client.end();
                res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
            }

        } else {
            res.status(400).json({ mensagem: 'CPF inválido' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}

async function editarUsuario(req, res) {
    const usuario_id = req.swagger.params.usuario_id.value;
    const nome = req.body.nome.trim();
    const data_nascimento = req.body.data_nascimento;
    const cpf = req.body.cpf;

    try {
        const client = new Client({ connectionString: urlConexao });
        await client.connect();

        await client.query('UPDATE usuario SET nome = $1, data_nascimento = $2, cpf = $3 WHERE id = $4', [nome, data_nascimento, cpf, usuario_id]);
        await client.end();

        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}

async function buscarUsuario(req, res, next) {
    const usuario_id = req.swagger.params.usuario_id.value;

    try {
        const client = new Client({ connectionString: urlConexao });
        await client.connect();

        await client.query('SELECT * FROM usuario WHERE id = $1', [usuario_id], function (err, result) {
            if (err) {
                return console.error(err);
            }

            // Verificando se o usuário NÃO foi encontrado
            if (result.rows.length == 0) {
                res.status(404).json({ mensagem: 'Usuário não encontrado ' });
                return next();
            }

            // Inserindo pontuação no CPF
            result.rows[0].cpf = validador_cpf.format(result.rows[0].cpf);

            res.status(200).json(result.rows);
        });
        await client.end();

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}

async function listarUsuarios(req, res) {

    try {
        const client = new Client({ connectionString: urlConexao });
        await client.connect();

        await client.query('SELECT * FROM usuario', function (err, result) {
            if (err) {
                return console.error(err);
            }

            // Inserindo pontuação nos CPFs
            result.rows.forEach(function (usuario) {
                usuario.cpf = validador_cpf.format(usuario.cpf);
            })

            res.status(200).json(result.rows);
        });
        await client.end();

    } catch (err) {
        console.log(err);
        res.status(500).json({ mensagem: err.toString() });
    }
}