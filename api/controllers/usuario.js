'use strict';

const db = require('../../config/pg_connection');
const Usuario = require('../../models/Usuario');
const validador_cpf = require('@fnando/cpf/dist/node');

module.exports = {
    cadastrar_usuario: cadastrarUsuario,
    editar_usuario: editarUsuario,
    buscar_usuario: buscarUsuario,
    listar_usuarios: listarUsuarios
};

async function cadastrarUsuario(req, res) {

    Usuario.findOne({
        where: {
            cpf: validador_cpf.strip(req.body.cpf) // retirado a pontuação do CPF
        }
    })
        .then(usuario => {
            if (usuario != null) {
                res.status(400).json({ mensagem: 'CPF informado já está cadastrado' });
            }
            else {
                let { nome, data_nascimento, cpf } = req.body;

                Usuario.create({
                    nome,
                    data_nascimento,
                    cpf: validador_cpf.strip(cpf) // retirado a pontuação do CPF
                })
                    .then(res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' }))
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}

async function editarUsuario(req, res) {

    let { nome, data_nascimento, cpf } = req.body;

    Usuario.update({
        nome,
        data_nascimento,
        cpf
    }, {
            where: {
                id: req.swagger.params.usuario_id.value
            }
        })
        .then(res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' }))
        .catch(err => console.log(err));
}

async function buscarUsuario(req, res) {

    Usuario.findOne({
        where: {
            id: req.swagger.params.usuario_id.value
        }
    })
        .then(usuario => {
            if (usuario != null) {
                res.status(200).json(usuario);
            }
            else {
                res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
        })
        .catch(err => console.log(err));
}

async function listarUsuarios(req, res) {

    Usuario.findAll()
        .then(usuarios => {

            // Inserindo pontuação nos CPFs
            usuarios.forEach(function (usuario) {
                usuario.cpf = validador_cpf.format(usuario.cpf);
            })

            res.status(200).json(usuarios);
        })
        .catch(err => console.log(err));

}