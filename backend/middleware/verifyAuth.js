const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt';

function verifyAuth(req, res, next) {
    // 1. Pega o token que está salvo no cookie 'token'
    const token = req.cookies.token;

    // 2. Se não houver token, o usuário não está autenticado
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // 3. Verifica se o token JWT é válido
        const decoded = jwt.verify(token, SECRET);
        
        // 4. Se for válido, anexa os dados do usuário (o payload do token) à requisição
        req.user = decoded;
        
        // 5. Continua para a próxima função (a rota do controller)
        next();
    } catch (error) {
        // Se o token for inválido ou expirado, retorna um erro
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
}

module.exports = verifyAuth;