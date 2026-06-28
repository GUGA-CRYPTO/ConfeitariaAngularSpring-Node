import * as repo from '../repository/vendaRepository.js';

export async function registrarVendaCompleta(venda) {
    let idVenda = await repo.salvarVenda(venda);
    for (let item of venda.itens) {
        await repo.salvarVendaItem(idVenda, item);
    }
    return idVenda;
}

export async function buscarVendas() { return await repo.listarVendas(); }

export async function buscarVendaComItens(id) {
    let venda = await repo.buscarVendaPorId(id);
    if(venda) {
        venda.itens = await repo.buscarItensDaVenda(id);
    }
    return venda;
}

export async function atualizarStatus(id, status) { return await repo.alterarStatusVenda(id, status); }

export async function removerVendaCompleta(id) {
    await repo.deletarItensDaVenda(id); // Limpa o carrinho
    return await repo.deletarVenda(id); // Apaga a sacola
}

export async function editarVendaCompleta(id, venda) { 
    return await repo.alterarVenda(id, venda); 
}
