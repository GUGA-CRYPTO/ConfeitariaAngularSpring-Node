import { Component, OnInit } from "@angular/core";
import { NgFor, NgIf, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { StoreService } from "../../../core/store.service";
import { Produto, VendaApi } from "../../../core/models";
import { AdminProdutosComponent } from "../admin-produtos/admin-produtos.component";

type Aba = "dashboard" | "produtos" | "vendas" | "financeiro" | "historico";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    DatePipe,
    AdminProdutosComponent,
  ],
  templateUrl: "./admin.component.html",
})
export class AdminComponent implements OnInit {
  aba: Aba = "dashboard";
  todayLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  cliente = "";
  itensVenda = [{ productId: 0, quantidade: 1 }];
  desconto = 0;
  formaPagamento = "pix";
  observacao = "";
  vendaSelecionada?: VendaApi;
  despesa = {
    data: new Date().toISOString().slice(0, 10),
    tipo: "ingredientes",
    descricao: "",
    valor: 0,
  };
  dataInicial = "";
  dataFinal = "";
  filtroPagamento = "";
  editandoVenda = false;
  vendaEditada: any = {};
  constructor(
    public store: StoreService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe(
      (p) => (this.aba = (p.get("aba") as Aba) || "dashboard"),
    );
    this.store.loadAdmin();
  }
  sair() {
    localStorage.removeItem("aura_token");
    this.router.navigate(["/"]);
  }

  get receitaTotal() {
    return this.store.sales.reduce((s, v) => s + Number(v.valor_total || 0), 0);
  }
  get despesasTotais() {
    return this.store.expenses.reduce((s, e) => s + Number(e.valor || 0), 0);
  }
  get lucro() {
    return this.receitaTotal - this.despesasTotais;
  }
  get vendasRecentes() {
    return this.store.sales
      .slice(0, 5)
      .map((s) => ({
        client: s.cliente_nome,
        date: s.data_venda,
        total: Number(s.valor_total),
        status: s.status
      }));
  }
  get ultimasVendas() {
    return [...this.store.sales].slice(0, 8).reverse();
  }

  get produtosMaisVendidos() {
    const map = new Map<string, number>();
    for (const s of this.store.sales) {
      for (const i of s.itens || []) {
        map.set(
          i.nome || "Produto",
          (map.get(i.nome || "Produto") || 0) + Number(i.quantidade || 0),
        );
      }
    }
    return [...map.entries()]
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }

  get kpis() {
    return [
      {
        label: "Receita Total",
        value: this.store.fmt(this.receitaTotal),
        sub: "Vendas registradas",
        icon: "◆",
      },
      {
        label: "Produtos",
        value: this.store.products.length,
        sub: "Itens cadastrados",
        icon: "✦",
      },
      {
        label: "Despesas",
        value: this.store.fmt(this.despesasTotais),
        sub: "Custos lançados",
        icon: "★",
      },
      {
        label: "Lucro",
        value: this.store.fmt(this.lucro),
        sub: "Receita - despesas",
        icon: "◈",
        color: this.lucro >= 0 ? "var(--success)" : "var(--danger)",
      },
    ];
  }

  alturaBarra(total: number | string) {
    const max = Math.max( ...this.ultimasVendas.map((s) => Number(s.valor_total || 0)), 1,);
    return Math.max(24, (Number(total || 0) / max) * 130);
  }

  adicionarItemVenda() {
    this.itensVenda.push({ productId: 0, quantidade: 1 });
  }
  removerItemVenda(i: number) {
    this.itensVenda.splice(i, 1);
    if (!this.itensVenda.length) this.adicionarItemVenda();
  }
  //------------------------------------------------
  get subtotalVenda() {
    return this.itensVenda.reduce((s, i) => {
      const p = this.store.products.find((x) => x.id == i.productId);
      return s + (p ? p.price * Number(i.quantidade || 1) : 0);
    }, 0);
  }
  get totalVenda() {
    return this.subtotalVenda * (1 - Number(this.desconto || 0) / 100);
  }

  registrarVenda() {
    for (const i of this.itensVenda) {
      const p = this.store.products.find((x) => x.id == i.productId);
      if (p) {
        if (Number(i.quantidade || 1) <= 0) return alert(`A quantidade do produto ${p.name} deve ser maior que zero.`);
        if (Number(i.quantidade || 1) > (p.estoque || 0)) {
          alert(`A quantidade do produto ${p.name} excede o estoque disponível (${p.estoque || 0}).`);
          return;
        }
      }
    }
    const itens = this.itensVenda
      .map((i) => {
        const p = this.store.products.find((x) => x.id == i.productId);
        return p ? {
              produto_id: p.id,
              quantidade: Number(i.quantidade || 1),
              preco_unitario: p.price,
              subtotal_item: p.price * Number(i.quantidade || 1),
            }
          : null;
      }).filter(Boolean) as any[];
    if (!this.cliente || !itens.length) {
      alert("Informe cliente e ao menos um produto.");
      return;
    }
    this.api.registrarVenda({
        cliente_nome: this.cliente,
        forma_pagamento: this.formaPagamento,
        observacao: this.observacao,
        desconto: Number(this.desconto || 0),
        subtotal: this.subtotalVenda,
        valor_total: this.totalVenda,
        status: "Concluída",
        itens,
      })
      .subscribe({
        next: () => {
          alert("Venda registrada!");
          this.limparFormularioVenda();
          this.store.reloadSales();
        },
        error: (e) => alert(e.error?.erro || "Erro ao registrar venda"),
      });
  }
  limparFormularioVenda() {
    this.cliente = "";
    this.itensVenda = [{ productId: 0, quantidade: 1 }];
    this.desconto = 0;
    this.formaPagamento = "pix";
    this.observacao = "";
  }
  get vendasDeHoje() {
    const today = new Date().toDateString();
    return this.store.sales.filter(
      (s) => new Date(s.data_venda).toDateString() === today,
    );
  }
  get totalDeHoje() {
    return this.vendasDeHoje.reduce(
      (s, v) => s + Number(v.valor_total || 0),
      0,
    );
  }
  //--------------------------Fim da tela de registrar vendas--------------------------------
  adicionarDespesa() {
    if (!this.despesa.descricao || !this.despesa.valor) {
      alert("Preencha descrição e valor.");
      return;
    }
    if (Number(this.despesa.valor) < 0) {
      alert("O valor da despesa não pode ser negativo.");
      return;
    }
    this.api
      .salvarDespesa({
        descricao: this.despesa.descricao,
        categoria: this.despesa.tipo,
        valor: Number(this.despesa.valor),
        data_despesa: this.despesa.data,
        status: "Pago",
      })
      .subscribe(() => {
        this.despesa = {
          data: new Date().toISOString().slice(0, 10),
          tipo: "ingredientes",
          descricao: "",
          valor: 0,
        };
        this.store.reloadExpenses();
      });
  }


  excluirDespesa(id: number | undefined) {
  if (!id) return;
  if (confirm('Tem certeza que deseja excluir esta despesa?')) {
    this.api.excluirDespesa(id).subscribe({
      next: () => {
        alert('Despesa excluída com sucesso!');
        this.store.reloadExpenses(); // Recarrega a lista de despesas automaticamente
      },
      error: (err) => alert('Erro ao excluir despesa.')
    });
  }
}
  
  get vendasFiltradas() {
    return this.store.sales.filter(
      (s) =>
        (!this.dataInicial || s.data_venda >= this.dataInicial) &&
        (!this.dataFinal || s.data_venda <= this.dataFinal + "T23:59:59") &&
        (!this.filtroPagamento || s.forma_pagamento === this.filtroPagamento),
    );
  }
  get totalFiltrado() {
    return this.vendasFiltradas.reduce(
      (s, v) => s + Number(v.valor_total || 0),
      0,
    );
  }
  limparFiltros() {
    this.dataInicial = "";
    this.dataFinal = "";
    this.filtroPagamento = "";
  }
  verDetalhes(s: VendaApi) {
    this.api.venda(s.id).subscribe((v) => {
        this.vendaSelecionada = v;
        this.editandoVenda = false;
    });
  }
excluirVenda(id: number | undefined) {
  if (!id) return;
  if (confirm('Atenção: Excluir esta venda é irreversível. Deseja continuar?')) {
    this.api.excluirVenda(id).subscribe({
      next: () => {
        alert('Venda excluída com sucesso!');
        this.vendaSelecionada = undefined; // Fecha o modal
        this.store.reloadSales(); // Recarrega a lista de vendas automaticamente
      },
      error: (err) => alert('Erro ao excluir venda.')
    });
  }
}

atualizarStatusVenda(id: number | undefined, novoStatus: string) {
  if (!id) return;
  this.api.alterarStatusVenda(id, novoStatus).subscribe({
    next: () => {
      alert('Status da venda atualizado com sucesso!');
      this.vendaSelecionada = undefined; // Fecha o modal
      this.store.reloadSales(); // Atualiza a lista na tela
    },
    error: (err) => alert('Erro ao atualizar status da venda.')
  });
}

iniciarEdicaoVenda() {
  this.editandoVenda = true;
  this.vendaEditada = {
    cliente_nome: this.vendaSelecionada?.cliente_nome,
    forma_pagamento: this.vendaSelecionada?.forma_pagamento,
    observacao: this.vendaSelecionada?.observacao,
    status: this.vendaSelecionada?.status
  };
}

salvarEdicaoVenda() {
  if (!this.vendaSelecionada) return;
  this.api.alterarVenda(this.vendaSelecionada.id, this.vendaEditada).subscribe({
    next: () => {
      alert('Venda editada com sucesso!');
      this.vendaSelecionada = undefined;
      this.editandoVenda = false;
      this.store.reloadSales();
    },
    error: (err) => alert('Erro ao editar venda.')
  });
}

}
