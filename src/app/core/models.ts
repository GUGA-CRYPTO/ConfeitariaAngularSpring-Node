export interface ProdutoApi {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number | string;
  estoque?: number;
  ingredientes?: string;
  status?: string;
  imagem?: string;
}
export interface Produto extends ProdutoApi {
  name: string;
  category: string;
  desc: string;
  price: number;
  emoji: string;
  badge?: string;
  bestseller: boolean;
  ingredients: string;
  imgError?: boolean;
}
export interface Despesa {
  id?: number;
  descricao: string;
  categoria: string;
  valor: number;
  data_despesa: string;
  status: string;
}
export interface VendaItemPayload {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal_item: number;
}
export interface VendaPayload {
  cliente_nome: string;
  forma_pagamento: string;
  observacao: string;
  desconto: number;
  subtotal: number;
  valor_total: number;
  status: string;
  itens: VendaItemPayload[];
}
export interface VendaApi {
  id: number;
  cliente_nome: string;
  forma_pagamento: string;
  observacao?: string;
  desconto: number;
  subtotal: number;
  valor_total: number;
  data_venda: string;
  status: string;
  itens?: any[];
}
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: string;
}
