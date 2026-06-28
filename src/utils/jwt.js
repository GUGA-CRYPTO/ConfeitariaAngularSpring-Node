import jwt from 'jsonwebtoken';

const SENHA_SECRETA = "AuraConfeitaria2026Secret";

export function gerarToken(usuarioInfo) {
    return jwt.sign(usuarioInfo, SENHA_SECRETA, { expiresIn: '8h' });
}

export function validarToken(req, resp, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return resp.status(401).send({ erro: 'Acesso negado. Faça login!' });
    }
    try {
        let dados = jwt.verify(token, SENHA_SECRETA);
        req.user = dados;
        next();
    } catch (err) {
        return resp.status(401).send({ erro: 'Sessão inválida ou expirada.' });
    }
}