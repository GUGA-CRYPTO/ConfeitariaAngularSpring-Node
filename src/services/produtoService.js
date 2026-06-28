import * as repo from '../repository/produtoRepository.js';

export async function adicionarProduto(produto) { return await repo.salvarProduto(produto); }
export async function buscarProdutos() { return await repo.listarProdutos(); }
export async function buscarProdutoPorId(id) { return await repo.buscarProdutoPorId(id); }
export async function removerProduto(id) { return await repo.deletarProduto(id); }

export async function atualizarProduto(id, produto) { 
    await repo.alterarProduto(id, produto);
    if (produto.imagem) { // Só atualiza a imagem se o Multer subiu um arquivo novo
        await repo.alterarImagemProduto(id, produto.imagem);
    }
}