/**
 * Conexão com PostgreSQL utilizando os dados de configuração do .env
 */

'use strict';

const urlConexao = `postgres://${process.env.BD_USUARIO}:${process.env.BD_SENHA}@${process.env.BD_HOST}:${process.env.BD_PORTA}/${process.env.BD_NOME}?application_name=${process.env.BD_NOME_APLICACAO}`;

module.exports = urlConexao;

