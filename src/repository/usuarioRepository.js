import connection from "./connection.js";

// POST (Login nós já tínhamos feito, mas vou deixar a função de criar usuário também)
export async function login(usuario, senhaMd5) {
    const comando = `SELECT id, nome, email, tipo_usuario FROM usuarios WHERE usuario = ? AND senha = ?`;
    const [linhas] = await connection.query(comando, [usuario, senhaMd5]);
    return linhas[0];
}

export async function salvarUsuario(usuario, senhaMd5) {
    const comando = `INSERT INTO usuarios (nome, email, usuario, senha, tipo_usuario, data_cadastro) VALUES (?, ?, ?, ?, ?, NOW())`;
    const [res] = await connection.query(comando, [usuario.nome, usuario.email, usuario.usuario, senhaMd5, usuario.tipo_usuario]);
    return res.insertId;
}

// GETs
export async function listarUsuarios() {
    const comando = `SELECT id, nome, email, usuario, tipo_usuario, data_cadastro FROM usuarios`;
    const [linhas] = await connection.query(comando);
    return linhas;
}

export async function buscarUsuarioPorId(id) {
    const comando = `SELECT id, nome, email, usuario, tipo_usuario, data_cadastro FROM usuarios WHERE id = ?`;
    const [linhas] = await connection.query(comando, [id]);
    return linhas[0];
}

// PUT
export async function alterarUsuario(id, usuario) {
    const comando = `UPDATE usuarios SET nome = ?, email = ?, usuario = ?, tipo_usuario = ? WHERE id = ?`;
    const [res] = await connection.query(comando, [usuario.nome, usuario.email, usuario.usuario, usuario.tipo_usuario, id]);
    return res.affectedRows;
}

// DELETE
export async function deletarUsuario(id) {
    const comando = `DELETE FROM usuarios WHERE id = ?`;
    const [res] = await connection.query(comando, [id]);
    return res.affectedRows;
}