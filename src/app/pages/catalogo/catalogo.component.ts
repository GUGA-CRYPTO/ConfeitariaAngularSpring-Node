import { Component, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { StoreService } from "../../core/store.service";
import { Produto } from "../../core/models";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../core/api.service";

@Component({
  selector: "app-catalogo",
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: "./catalogo.component.html",
})
export class CatalogoComponent implements OnInit {
  filtroAtivo = "todos";
  busca = "";
  produtoSelecionado?: Produto;
  isOrdering = false;
  pedido = { cliente_nome: '', observacao: '', forma_pagamento: 'pix', quantidade: 1 };
  constructor(
    public store: StoreService,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}
  ngOnInit() {
    if (!this.store.products.length) this.store.loadPublic();
    this.route.queryParams.subscribe((p) => {
      if (p["cat"]) this.filtroAtivo = p["cat"];
    });
  }

  definirFiltro(f: string) {
    this.filtroAtivo = f;
  }
  
  get produtosFiltrados() {
    const q = this.busca.toLowerCase();
    return this.store.products.filter(
      (p) =>
        (this.filtroAtivo === "todos" || p.category === this.filtroAtivo) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)),
    );
  }

  obterUrlImagem(imagem: string | null | undefined): string {
    if (!imagem) return "";
    if (imagem.startsWith("http")) return imagem;

    const imgPath = imagem.replace(/\\/g, "/").replace(/^\/+/, "");
    if (imgPath.startsWith("storage/")) {
      return `${environment.apiUrl}/${imgPath}`;
    }
    return `${environment.apiUrl}/storage/${imgPath}`;
  }

  abrirPedido() { 
    this.isOrdering = true; 
    this.pedido = { cliente_nome: '', observacao: '', forma_pagamento: 'pix', quantidade: 1 }; 
  }

  enviarPedido() {
    if (!this.pedido.cliente_nome) return alert('Por favor, informe seu nome!');
    if (!this.produtoSelecionado) return;
    if (this.pedido.quantidade <= 0) return alert('A quantidade deve ser maior que zero.');
    if (this.pedido.quantidade > (this.produtoSelecionado.estoque || 0)) return alert(`A quantidade solicitada excede o estoque disponível (${this.produtoSelecionado.estoque || 0}).`);

    const subtotal = this.produtoSelecionado.price * this.pedido.quantidade;
    
    const payload = {
      cliente_nome: this.pedido.cliente_nome,
      forma_pagamento: this.pedido.forma_pagamento,
      observacao: this.pedido.observacao,
      desconto: 0,
      subtotal: subtotal,
      valor_total: subtotal,
      status: 'Pendente',
      itens: [{
        produto_id: this.produtoSelecionado.id,
        quantidade: this.pedido.quantidade,
        preco_unitario: this.produtoSelecionado.price,
        subtotal_item: subtotal
      }]
    };

    this.api.registrarPedido(payload).subscribe({
      next: () => { alert('Pedido enviado com sucesso! Aguarde nosso contato.'); this.produtoSelecionado = undefined; this.isOrdering = false; },
      error: () => alert('Erro ao enviar pedido. Tente novamente.')
    });
  }
}
