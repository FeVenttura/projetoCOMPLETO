const Sequelize = require('sequelize');

// Carrega as variáveis de ambiente a partir de um arquivo .env para manter
// as credenciais do banco de dados separadas e seguras, fora do código-fonte.
require('dotenv').config();

// Inicializa a instância do Sequelize utilizando as credenciais seguras
// fornecidas pelas variáveis de ambiente, prevenindo a exposição de dados sensíveis
// (hardcoded credentials) no código.
const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        // Desativa os logs de queries SQL no console. Em um ambiente de produção,
        // isso previne a exposição acidental de dados sensíveis ou da estrutura do banco.
        logging: false,
    }
);

// Bloco de verificação para testar a validade das credenciais e a conexão
// com o banco de dados na inicialização da aplicação.
db.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

module.exports = db;