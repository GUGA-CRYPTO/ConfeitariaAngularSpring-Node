import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { StoreService } from '../../../core/store.service';
import { Produto } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './admin-produtos.component.html'
})
export class AdminProdutosComponent {
  produtoForm: any = { nome: '', descricao: '', categoria: 'trufas', preco: 0, estoque: 0, ingredientes: '', status: 'Ativo', imagem: null }; 
  produtoEditando?: Produto; 
  mostrarFormularioProduto = false;

  constructor(public store: StoreService, private api: ApiService) {}

  abrirNovoProduto() { 
    this.produtoEditando = undefined; 
    this.produtoForm = { nome: '', descricao: '', categoria: 'trufas', preco: 0, estoque: 0, ingredientes: '', status: 'Ativo', imagem: null }; 
    this.mostrarFormularioProduto = true; 
  }
  
  editarProduto(p: Produto) { 
    this.produtoEditando = p; 
    this.produtoForm = { nome: p.nome, descricao: p.descricao, categoria: p.categoria, preco: p.price, estoque: p.estoque || 0, ingredientes: p.ingredients, status: p.status || 'Ativo', imagem: null }; 
    this.mostrarFormularioProduto = true; 
  }
  aoSelecionarArquivo(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.produtoForm.imagem = file;
    }
  }
  salvarProduto() { 
    if (Number(this.produtoForm.preco) < 0) return alert('O valor (preço) não pode ser negativo.');
    if (Number(this.produtoForm.estoque) < 0) return alert('O estoque não pode ser negativo.');
    this.api.salvarProduto(this.produtoForm, this.produtoEditando?.id).subscribe({ next: () => { this.mostrarFormularioProduto = false; this.store.reloadProducts(); }, error: e => alert(e.error?.erro || 'Erro ao salvar produto') }); 
  }
  excluirProduto(id: number) { 
    if (confirm('Excluir este produto?')) this.api.excluirProduto(id).subscribe(() => this.store.reloadProducts()); 
  }
  obterUrlImagem(imagem: string | null | undefined): string {
    if (!imagem) return '';
    if (imagem.startsWith('http')) return imagem;
    
    const imgPath = imagem.replace(/\\/g, '/').replace(/^\/+/, '');
    if (imgPath.startsWith('storage/')) {
      return `${environment.apiUrl}/${imgPath}`;
    }
    return `${environment.apiUrl}/storage/${imgPath}`;
  }
}