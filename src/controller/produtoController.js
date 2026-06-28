import * as service from '../services/produtoService.js';
import upload from '../utils/multer.js';
import { validarToken } from '../utils/jwt.js';
import { Router } from "express";

const endpoints = Router();


endpoints.get('/produto', async (req, resp) => { resp.send(await service.buscarProdutos()); });
endpoints.get('/produto/:id', async (req, resp) => { resp.send(await service.buscarProdutoPorId(req.params.id)); });


endpoints.post('/produto', validarToken, upload.single('imagem'), async (req, resp) => {
    try {
        let produto = req.body;
        produto.imagem = req.file ? req.file.filename : null;
        let id = await service.adicionarProduto(produto);
        resp.send({ id: id, mensagem: "Produto cadastrado!" });
    } catch (err) { resp.status(400).send({ erro: "Erro ao salvar." }); }
});

endpoints.put('/produto/:id', validarToken, upload.single('imagem'), async (req, resp) => {
    try {
        let produto = req.body;
        produto.imagem = req.file ? req.file.filename : null; // Se veio foto nova, atualiza
        await service.atualizarProduto(req.params.id, produto);
        resp.send({ mensagem: "Produto atualizado!" });
    } catch (err) { resp.status(400).send({ erro: "Erro ao atualizar." }); }
});

endpoints.delete('/produto/:id', validarToken, async (req, resp) => {
    try {
        await service.removerProduto(req.params.id);
        resp.send({ mensagem: "Produto deletado!" });
    } catch (err) { resp.status(400).send({ erro: "Erro ao deletar. Produto pode estar em alguma venda." }); }
});

export default endpoints;