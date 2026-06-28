import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Despesa, ProdutoApi, VendaApi, VendaPayload } from "./models";

@Injectable({ providedIn: "root" })
export class ApiService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(usuario: string, senha: string) {
    return this.http.post<{ token: string; usuario: any }>(
      `${this.api}/login`,
      { usuario, senha },
    );
  }
  produtos() {
    return this.http.get<ProdutoApi[]>(`${this.api}/produto`);
  }
  produto(id: number) {
    return this.http.get<ProdutoApi>(`${this.api}/produto/${id}`);
  }
  salvarProduto(dados: any, id?: number) {
    const fd = new FormData();
    Object.entries(dados).forEach(([k, v]) => {
      if (v instanceof File) {
        fd.append(k, v, v.name);
      } else if (v !== null && v !== undefined) {
        fd.append(k, String(v));
      }
    });
    return id
      ? this.http.put(`${this.api}/produto/${id}`, fd)
      : this.http.post(`${this.api}/produto`, fd);
  }
  excluirProduto(id: number) {
    return this.http.delete(`${this.api}/produto/${id}`);
  }

  vendas() {
    return this.http.get<VendaApi[]>(`${this.api}/venda`);
  }
  venda(id: number) {
    return this.http.get<VendaApi>(`${this.api}/venda/${id}`);
  }
  registrarVenda(venda: VendaPayload) {
    return this.http.post(`${this.api}/venda`, venda);
  }
  registrarPedido(venda: VendaPayload) {
    return this.http.post(`${this.api}/pedido`, venda);
  }
  excluirVenda(id: number) {
    return this.http.delete(`${this.api}/venda/${id}`);
  }

  despesas() {
    return this.http.get<Despesa[]>(`${this.api}/despesa`);
  }
  salvarDespesa(despesa: Despesa, id?: number) {
    return id
      ? this.http.put(`${this.api}/despesa/${id}`, despesa)
      : this.http.post(`${this.api}/despesa`, despesa);
  }
  excluirDespesa(id: number) {
    return this.http.delete(`${this.api}/despesa/${id}`);
  }

  alterarStatusVenda(id: number, status: string) {
    return this.http.put(`${this.api}/venda/${id}/status`, { status });
  }

  alterarVenda(id: number, venda: any) {
    return this.http.put(`${this.api}/venda/${id}`, venda);
  }

  alterarDespesa(id: number, despesa: any) {
    return this.http.put(`${this.api}/despesa/${id}`, despesa);
  }

  // --- USUÁRIOS ---
  excluirUsuario(id: number) {
    return this.http.delete(`${this.api}/usuario/${id}`);
  }
  alterarUsuario(id: number, usuario: any) {
    return this.http.put(`${this.api}/usuario/${id}`, usuario);
  }
}
