import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { Despesa, Produto, ProdutoApi, VendaApi } from './models';

@Injectable({ providedIn: 'root' })
export class StoreService {
  products: Produto[] = [];
  sales: VendaApi[] = [];
  expenses: Despesa[] = [];
  loaded$ = new BehaviorSubject(false);

  fallbackProducts: ProdutoApi[] = [
    {id:1,nome:'Trufa Belga Intensa',descricao:'Ganache 70% com final aveludado.',categoria:'trufas',preco:14.9,estoque:20,ingredientes:'Chocolate belga, creme de leite, cacau'},
    {id:2,nome:'Macaron Framboise',descricao:'Casquinha delicada e recheio de framboesa.',categoria:'macarons',preco:12.5,estoque:30,ingredientes:'Amêndoas, framboesa, chocolate branco'},
    {id:3,nome:'Bombom Pistache Dourado',descricao:'Cremoso, crocante e sofisticado.',categoria:'bombons',preco:16,estoque:18,ingredientes:'Pistache, chocolate branco, flor de sal'},
    {id:4,nome:'Torta Noir',descricao:'Camadas de chocolate, caramelo e crocante.',categoria:'tortas',preco:89.9,estoque:6,ingredientes:'Chocolate, caramelo, farinha, manteiga'},
    {id:5,nome:'Caixa Edição Aura',descricao:'Seleção premium para presentear.',categoria:'especiais',preco:129.9,estoque:8,ingredientes:'Mix de doces artesanais'}
  ];

  constructor(private api: ApiService) {}

  loadPublic() {
    return this.api.produtos().pipe(catchError(() => of(this.fallbackProducts))).subscribe(ps => {
      this.products = (ps?.length ? ps : this.fallbackProducts).map((p, i) => this.mapProduct(p, i));
      this.loaded$.next(true);
    });
  }

  loadAdmin() {
    return forkJoin({
      produtos: this.api.produtos().pipe(catchError(() => of(this.fallbackProducts))),
      vendas: this.api.vendas().pipe(catchError(() => of([] as VendaApi[]))),
      despesas: this.api.despesas().pipe(catchError(() => of([] as Despesa[])))
    }).subscribe(r => {
      this.products = (r.produtos?.length ? r.produtos : this.fallbackProducts).map((p, i) => this.mapProduct(p, i));
      this.sales = r.vendas || [];
      this.expenses = r.despesas || [];
      this.loaded$.next(true);
    });
  }

  reloadSales() { this.api.vendas().pipe(catchError(() => of([]))).subscribe(v => this.sales = v); }
  reloadExpenses() { this.api.despesas().pipe(catchError(() => of([]))).subscribe(d => this.expenses = d); }
  reloadProducts() { this.api.produtos().pipe(catchError(() => of(this.fallbackProducts))).subscribe(p => this.products = p.map((x, i) => this.mapProduct(x, i))); }

  mapProduct(p: ProdutoApi, i = 0): Produto {
    const emojis: Record<string,string> = { trufas:'🍫', macarons:'🥮', bombons:'🍬', tortas:'🎂', especiais:'🎁' };
    const categoria = (p.categoria || 'especiais').toLowerCase();
    return { ...p, category: categoria, name: p.nome, desc: p.descricao, price: Number(p.preco), emoji: emojis[categoria] || '✦', badge: i < 2 ? 'Favorito' : '', bestseller: i < 3, ingredients: p.ingredientes || 'Ingredientes selecionados da casa' };
  }

  
  fmt(v: number | string | undefined) { return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  fmtDate(v: string | Date) { return new Date(v).toLocaleString('pt-BR'); }
  categoryLabel(c: string) { return ({trufas:'Trufas', macarons:'Macarons', bombons:'Bombons', tortas:'Tortas', especiais:'Especiais'} as any)[c] || c; }
}
