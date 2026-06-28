import connection from "./connection.js";

export async function salvarDespesa(d) {
    const comando = `INSERT INTO despesas (usuario_id, descricao, categoria, valor, data_despesa, status, data_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    const [res] = await connection.query(comando, [d.usuario_id, d.descricao, d.categoria, d.valor, d.data_despesa, d.status]);
    return res.insertId;
}

export async function listarDespesas() {
    const comando = `SELECT id, usuario_id, descricao, categoria, valor, DATE_FORMAT(data_despesa, '%Y-%m-%d') as data_despesa, status FROM despesas ORDER BY data_despesa DESC`;
    const [linhas] = await connection.query(comando);
    return linhas;
}

export async function buscarDespesaPorId(id) {
    const comando = `SELECT id, usuario_id, descricao, categoria, valor, DATE_FORMAT(data_despesa, '%Y-%m-%d') as data_despesa, status FROM despesas WHERE id = ?`;
    const [linhas] = await connection.query(comando, [id]);
    return linhas[0];
}

export async function alterarDespesa(id, d) {
    const comando = `UPDATE despesas SET descricao=?, categoria=?, valor=?, data_despesa=?, status=? WHERE id=?`;
    const [res] = await connection.query(comando, [d.descricao, d.categoria, d.valor, d.data_despesa, d.status, id]);
    return res.affectedRows;
}

export async function deletarDespesa(id) {
    const comando = `DELETE FROM despesas WHERE id = ?`;
    const [res] = await connection.query(comando, [id]);
    return res.affectedRows;
}