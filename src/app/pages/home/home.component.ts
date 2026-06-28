import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/store.service';
import { Produto } from '../../core/models';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api.service';

@Component({selector:'app-home', standalone:true, imports:[NgFor,NgIf,FormsModule,RouterLink], templateUrl:'./home.component.html'})
export class HomeComponent implements OnInit {
  selectedProduct?: Produto; newsletterEmail='';
  isOrdering = false;
  pedido = { cliente_nome: '', observacao: '', forma_pagamento: 'pix', quantidade: 1 };
  testimonials=[{text:'Uma experiência elegante do começo ao fim. Os doces são impecáveis.',initial:'M',name:'Marina Lopes',city:'São Paulo'},{text:'A caixa presente virou tradição aqui em casa. Tudo lindo e delicioso.',initial:'R',name:'Rafael Dias',city:'Campinas'},{text:'Macarons perfeitos, atendimento cuidadoso e visual maravilhoso.',initial:'B',name:'Bianca Alves',city:'Santo André'}];
  constructor(public store:StoreService, private api: ApiService){}
  ngOnInit(){ if(!this.store.products.length) this.store.loadPublic(); }
  get bestsellers(){ return this.store.products.filter(p=>p.bestseller).slice(0,3); }
  scrollTo(id:string){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }
  subscribeNewsletter(){ alert(this.newsletterEmail ? 'Inscrição realizada!' : 'Digite um e-mail.'); this.newsletterEmail=''; }
  abrirPedido() { this.isOrdering = true; this.pedido = { cliente_nome: '', observacao: '', forma_pagamento: 'pix', quantidade: 1 }; }

  obterUrlImagem(imagem: string | null | undefined): string {
    if (!imagem) return '';
    if (imagem.startsWith('http')) return imagem;
    
    const imgPath = imagem.replace(/\\/g, '/').replace(/^\/+/, '');
    if (imgPath.startsWith('storage/')) {
      return `${environment.apiUrl}/${imgPath}`;
    }
    return `${environment.apiUrl}/storage/${imgPath}`; 
  }

  enviarPedido() {
    if (!this.pedido.cliente_nome) return alert('Por favor, informe seu nome!');
    if (!this.selectedProduct) return;
    if (this.pedido.quantidade <= 0) return alert('A quantidade deve ser maior que zero.');
    if (this.pedido.quantidade > (this.selectedProduct.estoque || 0)) return alert(`A quantidade solicitada excede o estoque disponível (${this.selectedProduct.estoque || 0}).`);

    const subtotal = this.selectedProduct.price * this.pedido.quantidade;
    
    const payload = {
      cliente_nome: this.pedido.cliente_nome,
      forma_pagamento: this.pedido.forma_pagamento,
      observacao: this.pedido.observacao,
      desconto: 0,
      subtotal: subtotal,
      valor_total: subtotal,
      status: 'Pendente',
      itens: [{
        produto_id: this.selectedProduct.id,
        quantidade: this.pedido.quantidade,
        preco_unitario: this.selectedProduct.price,
        subtotal_item: subtotal
      }]
    };

    this.api.registrarPedido(payload).subscribe({
      next: () => { alert('Pedido enviado com sucesso! Aguarde nosso contato.'); this.selectedProduct = undefined; this.isOrdering = false; },
      error: () => alert('Erro ao enviar pedido. Tente novamente.')
    });
  }
}
