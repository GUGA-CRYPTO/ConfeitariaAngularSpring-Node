import * as service from '../services/vendaService.js';
import { validarToken } from '../utils/jwt.js';
import { Router } from "express";

const endpoints = Router();
endpoints.post('/venda', validarToken, async (req, resp) => {
    try {
        let venda = req.body;
        venda.usuario_id = req.user.id; 
        let id = await service.registrarVendaCompleta(venda);
        resp.send({ idVenda: id, mensagem: "Venda registrada com sucesso!" });
    } catch (err) { resp.status(400).send({ erro: "Erro ao registrar a venda." }); }
});

endpoints.get('/venda', validarToken, async (req, resp) => {
    resp.send(await service.buscarVendas());
});

endpoints.get('/venda/:id', validarToken, async (req, resp) => {
    let venda = await service.buscarVendaComItens(req.params.id);
    if(!venda) return resp.status(404).send({ erro: "Venda não encontrada" });
    resp.send(venda);
});
endpoints.put('/venda/:id/status', validarToken, async (req, resp) => {
    try {
        await service.atualizarStatus(req.params.id, req.body.status);
        resp.send({ mensagem: "Status atualizado!" });
    } catch (err) { resp.status(400).send({ erro: "Erro ao atualizar." }); }
});
endpoints.delete('/venda/:id', validarToken, async (req, resp) => {
    try {
        await service.removerVendaCompleta(req.params.id);
        resp.send({ mensagem: "Venda e itens deletados!" });
    } catch (err) { resp.status(400).send({ erro: "Erro ao deletar venda." }); }
});

endpoints.put('/venda/:id', validarToken, async (req, resp) => {
    try {
        let id = req.params.id;
        let venda = req.body;
        
        let linhasAfetadas = await service.editarVendaCompleta(id, venda);
        
        if (linhasAfetadas > 0) {
            resp.send({ mensagem: "Venda alterada com sucesso!" });
        } else {
            resp.status(404).send({ erro: "Venda não encontrada." });
        }
    } catch (err) { 
        resp.status(400).send({ erro: "Erro ao alterar a venda." }); 
    }
});
endpoints.post('/pedido', async (req, resp) => {
    try {
        let pedido = req.body;
       
        pedido.usuario_id = null; 
        
        let id = await service.registrarVendaCompleta(pedido);
        resp.send({ idVenda: id, mensagem: "Pedido registrado com sucesso pelo site!" });
    } catch (err) { 
        resp.status(400).send({ erro: "Erro ao registrar o pedido." }); 
    }
});


export default endpoints;