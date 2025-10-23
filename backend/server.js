// --- Importações de Módulos Essenciais ---
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env no início do processo.
const express = require('express');
const path = require('path');
const db = require('./config/db');

// --- Importações das Camadas de Segurança ---
const cors = require('cors');           // Controla o acesso de diferentes origens (frontends).
const helmet = require('helmet');         // Adiciona uma camada de segurança nos cabeçalhos HTTP.
const cookieParser = require('cookie-parser'); // Middleware para analisar os cookies das requisições.
const csrf = require('csurf');           // Proteção contra ataques de Cross-Site Request Forgery.
const verifyAuth = require('./middleware/verifyAuth'); // Middleware que verifica o token JWT no cookie.

// --- Importações das Rotas da Aplicação ---
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// --- Importações dos Modelos para Sincronização ---
const User = require('./models/user');
const Category = require('./models/category');
const Transaction = require('./models/transaction');

// --- Inicialização do Express ---
const app = express();

// --- Configuração dos Middlewares Globais ---

// Camada 1: Segurança de Cabeçalhos HTTP (Helmet).
app.use(helmet());

// Camada 2: Política de Acesso (CORS).
app.use(cors({
    origin: 'http://localhost:5500', // Endereço do frontend (Live Server)
    credentials: true
}));

// Middlewares para processar o corpo das requisições e cookies.
app.use(express.json());
app.use(cookieParser());

// --- Definição das Rotas Públicas ---
// Rotas de autenticação (login/registro) são definidas ANTES de qualquer proteção de sessão.
app.use('/api/auth', authRoutes);

// --- Ativação da Camada 3: Proteção CSRF ---
// O 'csurf' protege contra ataques de Cross-Site Request Forgery em rotas que alteram estado.
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        secure: true, // Em produção (HTTPS), mude para 'true'
        sameSite: 'strict'
    } 
});
app.use(csrfProtection);

// Endpoint seguro para que o frontend (já autenticado) possa obter o token CSRF.
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// --- Ativação da Camada 4: Verificação de Autenticação ---
// Este middleware verifica o cookie de token em todas as rotas abaixo dele
// e cria o `req.user` se a autenticação for válida.
app.use(verifyAuth);

// --- Definição das Rotas Protegidas ---
// Todas estas rotas exigem uma sessão válida (verificada pelo 'verifyAuth')
// e proteção CSRF (verificada pelo 'csrfProtection').
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Middleware para servir arquivos estáticos (cupons fiscais).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Captura erros para evitar vazar informações sensíveis do servidor.
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ error: 'CSRF token inválido.' });
    }
    res.status(500).send('Algo deu errado no servidor!');
});

// --- Sincronização com o Banco de Dados e Inicialização do Servidor ---

// Define os relacionamentos entre as tabelas.
User.hasMany(Transaction, { foreignKey: 'idUser' });
Transaction.belongsTo(User, { foreignKey: 'idUser' });
Category.hasMany(Transaction, { foreignKey: 'idCategory' });
Transaction.belongsTo(Category, { foreignKey: 'idCategory' });

// Sincroniza os modelos e inicia o servidor web.
db.sync({ force: false })
    .then(() => {
        console.log('Banco de dados conectado e sincronizado!');
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar com o banco de dados:', error);
    });