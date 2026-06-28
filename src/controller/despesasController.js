import * as service from "../services/despesasService.js";
import { validarToken } from "../utils/jwt.js";
import { Router } from "express";

const endpoints = Router();


endpoints.post("/despesa", validarToken, async (req, resp) => {
  try {
    let despesa = req.body;
    despesa.usuario_id = req.user.id; // Vincula ao usuário logado
    let id = await service.adicionarDespesa(despesa);
    resp.send({ id: id, mensagem: "Despesa registrada!" });
  } catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

endpoints.get("/despesa", validarToken, async (req, resp) => {
  resp.send(await service.buscarDespesas());
});
endpoints.get("/despesa/:id", validarToken, async (req, resp) => {
  resp.send(await service.buscarDespesaPorId(req.params.id));
});

endpoints.put("/despesa/:id", validarToken, async (req, resp) => {
  try {
    await service.atualizarDespesa(req.params.id, req.body);
    resp.send({ mensagem: "Despesa atualizada!" });
  } catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

endpoints.delete("/despesa/:id", validarToken, async (req, resp) => {
  try {
    await service.removerDespesa(req.params.id);
    resp.send({ mensagem: "Despesa deletada!" });
  } catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

export default endpoints;
