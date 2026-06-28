import connection from "./connection.js";

export async function salvarProduto(p) {
    const comando = `INSERT INTO produtos (nome, descricao, categoria, preco, estoque, ingredientes, status, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [res] = await connection.query(comando, [p.nome, p.descricao, p.categoria, p.preco, p.estoque, p.ingredientes, p.status, p.imagem]);
    return res.insertId;
}

export async function listarProdutos() {
    const comando = `SELECT * FROM produtos`;
    const [linhas] = await connection.query(comando);
    return linhas;
}

export async function buscarProdutoPorId(id) {
    const comando = `SELECT * FROM produtos WHERE id = ?`;
    const [linhas] = await connection.query(comando, [id]);
    return linhas[0];
}

export async function alterarProduto(id, p) {
    const comando = `UPDATE produtos SET nome=?, descricao=?, categoria=?, preco=?,
     estoque=?, ingredientes=?, status=? WHERE id=?`;
    const [res] = await connection.query(comando, [p.nome, p.descricao, p.categoria, p.preco, p.estoque,
    p.ingredientes, p.status, id]);
    return res.affectedRows;
}

export async function alterarImagemProduto(id, imagem) {
    const comando = `UPDATE produtos SET imagem=? WHERE id=?`;
    await connection.query(comando, [imagem, id]);
}

export async function deletarProduto(id) {
    const comando = `DELETE FROM produtos WHERE id = ?`;
    const [res] = await connection.query(comando, [id]);
    return res.affectedRows;
}