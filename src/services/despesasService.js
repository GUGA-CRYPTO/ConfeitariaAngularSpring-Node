import * as repo from '../repository/despesasRepository.js';

export async function adicionarDespesa(d) { return await repo.salvarDespesa(d); }
export async function buscarDespesas() { return await repo.listarDespesas(); }
export async function buscarDespesaPorId(id) { return await repo.buscarDespesaPorId(id); }
export async function atualizarDespesa(id, d) { return await repo.alterarDespesa(id, d); }
export async function removerDespesa(id) { return await repo.deletarDespesa(id); }