import connection from "./connection.js";

export async function salvarVenda(v) {
    const comando = `INSERT INTO vendas (usuario_id, cliente_nome, forma_pagamento, observacao, desconto, subtotal, valor_total, data_venda, status) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
    const [res] = await connection.query(comando, [v.usuario_id, v.cliente_nome, v.forma_pagamento, v.observacao, v.desconto, v.subtotal, v.valor_total, v.status]);
    return res.insertId; 
}

export async function salvarVendaItem(idVenda, item) {
    const comando = `INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco_unitario, subtotal_item) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(comando, [idVenda, item.produto_id, item.quantidade, item.preco_unitario, item.subtotal_item]);
}

export async function listarVendas() {
    const comando = `SELECT * FROM vendas ORDER BY data_venda DESC`;
    const [linhas] = await connection.query(comando);
    return linhas;
}

export async function buscarVendaPorId(id) {
    const comando = `SELECT * FROM vendas WHERE id = ?`;
    const [linhas] = await connection.query(comando, [id]);
    return linhas[0];
}

export async function buscarItensDaVenda(idVenda) {
    const comando = `SELECT vi.*, p.nome FROM venda_itens vi JOIN produtos p ON vi.produto_id = p.id WHERE vi.venda_id = ?`;
    const [linhas] = await connection.query(comando, [idVenda]);
    return linhas;
}

export async function alterarStatusVenda(id, status) {
    const comando = `UPDATE vendas SET status = ? WHERE id = ?`;
    const [res] = await connection.query(comando, [status, id]);
    return res.affectedRows;
}

// Para deletar uma venda, apagamos os itens primeiro!
export async function deletarItensDaVenda(idVenda) {
    const comando = `DELETE FROM venda_itens WHERE venda_id = ?`;
    await connection.query(comando, [idVenda]);
}

export async function deletarVenda(id) {
    const comando = `DELETE FROM vendas WHERE id = ?`;
    const [res] = await connection.query(comando, [id]);
    return res.affectedRows;
}

export async function alterarVenda(id, venda) {
    const comando = `UPDATE vendas SET cliente_nome = ?, forma_pagamento = ?, observacao = ?, status = ? WHERE id = ?`;
    const [res] = await connection.query(comando, [venda.cliente_nome, venda.forma_pagamento, venda.observacao, venda.status, id]);
    return res.affectedRows;
}