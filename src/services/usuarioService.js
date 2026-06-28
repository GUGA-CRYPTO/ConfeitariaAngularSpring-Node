import * as repo from '../repository/usuarioRepository.js';
import md5 from 'md5';

export async function logar(usuario, senha) {
    let senhaCriptografada = md5(senha);
    return await repo.login(usuario, senhaCriptografada);
}

export async function adicionarUsuario(usuario) {
    let senhaCriptografada = md5(usuario.senha); // Criptografa na hora de criar!
    return await repo.salvarUsuario(usuario, senhaCriptografada);
}

export async function buscarUsuarios() { return await repo.listarUsuarios(); }
export async function buscarUsuarioPorId(id) { return await repo.buscarUsuarioPorId(id); }
export async function atualizarUsuario(id, usuario) { return await repo.alterarUsuario(id, usuario); }
export async function removerUsuario(id) { return await repo.deletarUsuario(id); }