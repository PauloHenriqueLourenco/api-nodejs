'use strict';

const db = require('../../config/pg_connection');
const Endereco = require('../../models/endereco');
const urlConexao = require('../../config/pg_connection');
const Op = require('sequelize').Op;

module.exports = {
    cadastrar_endereco: cadastrarEndereco,
    listar_enderecos_usuario: listarEnderecosUsuario,
    listar_enderecos: listarEnderecos
};

async function cadastrarEndereco(req, res) {

    let { rua, numero, complemento, bairro, usuario_id } = req.body;

    Endereco.create({
        rua,
        numero,
        complemento,
        bairro,
        usuario_id
    })
        .then(res.status(201).json({ mensagem: 'Endereço cadastrado com sucesso!' })
            .catch(err => console.log(err)));
}

async function listarEnderecosUsuario(req, res) {

    Endereco.findAll({
        where: {
            usuario_id: req.swagger.params.usuario_id.value
        }
    })
        .then(enderecos => {
            var logradouros = [];

            enderecos.forEach(function (endereco) {
                var rua = endereco.rua;
                var numero = endereco.numero == null ? 's/n' : endereco.numero;
                var complemento = endereco.complemento != null ? ' - ' + endereco.complemento : '';
                var bairro = endereco.bairro;

                logradouros.push({
                    'endereco': rua + ', ' + numero + complemento,
                    'bairro': bairro
                });
            })
            const lista = {
                'total': enderecos.length,
                'enderecos': logradouros
            }

            res.status(200).json(lista);
        })
        .catch(err => console.log(err));
}

async function listarEnderecos(req, res) {

    if (typeof req.query.bairro == 'undefined')
        Endereco.findAll()
            .then(enderecos => {
                res.status(200).json(enderecos);
            })
            .catch(err => console.log(err));
    else {
        Endereco.findAll({
            where: {
                bairro: {
                    [Op.iLike]: req.query.bairro
                }
            }
        })
            .then(enderecos => {
                res.status(200).json(enderecos);
            })
            .catch(err => console.log(err));
    }
}