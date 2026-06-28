import * as service from '../services/usuarioService.js';
import { gerarToken, validarToken } from '../utils/jwt.js';
import { Router } from "express";

const endpoints = Router();

// Rota Pública (Login)
endpoints.post('/login', async (req, resp) => {
    let { usuario, senha } = req.body;
    let dadosUser = await service.logar(usuario, senha);
    if (!dadosUser) return resp.status(401).send({ erro: "Credenciais inválidas." });
    resp.send({ token: gerarToken(dadosUser), usuario: dadosUser });
});

// Rotas Protegidas (CRUD)
endpoints.post('/usuario', validarToken, async (req, resp) => {
    try {
        let id = await service.adicionarUsuario(req.body);
        resp.send({ id: id, mensagem: "Usuário criado!" });
    } catch (err) { resp.status(400).send({ erro: err.message }); }
});

endpoints.get('/usuario', validarToken, async (req, resp) => {
    resp.send(await service.buscarUsuarios());
});

endpoints.get('/usuario/:id', validarToken, async (req, resp) => {
    resp.send(await service.buscarUsuarioPorId(req.params.id));
});

endpoints.put('/usuario/:id', validarToken, async (req, resp) => {
    try {
        await service.atualizarUsuario(req.params.id, req.body);
        resp.send({ mensagem: "Usuário atualizado!" });
    } catch (err) { resp.status(400).send({ erro: err.message }); }
});

endpoints.delete('/usuario/:id', validarToken, async (req, resp) => {
    try {
        await service.removerUsuario(req.params.id);
        resp.send({ mensagem: "Usuário deletado!" });
    } catch (err) { resp.status(400).send({ erro: "Erro. Usuário pode ter vendas atreladas." }); }
});

export default endpoints;