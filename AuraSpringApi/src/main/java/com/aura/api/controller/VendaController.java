package com.aura.api.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aura.api.dto.StatusRequest;
import com.aura.api.model.Produto;
import com.aura.api.model.Venda;
import com.aura.api.model.VendaItem;
import com.aura.api.repository.ProdutoRepository;
import com.aura.api.repository.VendaRepository;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class VendaController {
    private final VendaRepository vendaRepo;
    private final ProdutoRepository produtoRepo;
    public VendaController(VendaRepository vendaRepo, ProdutoRepository produtoRepo) { this.vendaRepo = vendaRepo; this.produtoRepo = produtoRepo; }

    @GetMapping("/venda") public List<Venda> listar() { return vendaRepo.findAllByOrderByDataVendaDesc(); }
    @GetMapping("/venda/{id}") public ResponseEntity<?> porId(@PathVariable Long id) { return vendaRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }

    @PostMapping("/venda") public ResponseEntity<?> registrarVenda(@RequestBody Venda venda, HttpServletRequest req) {
        Object uid = req.getAttribute("usuario_id");
        venda.usuarioId = uid instanceof Long ? (Long) uid : null;
        return salvarVenda(venda, "Venda registrada com sucesso!");
    }

    @PostMapping("/pedido") public ResponseEntity<?> registrarPedido(@RequestBody Venda venda) {
        venda.usuarioId = null;
        if (venda.status == null || venda.status.isBlank()) venda.status = "Pendente";
        return salvarVenda(venda, "Pedido registrado com sucesso pelo site!");
    }

    @PutMapping("/venda/{id}/status") public ResponseEntity<?> alterarStatus(@PathVariable Long id, @RequestBody StatusRequest req) {
        return vendaRepo.findById(id).map(v -> { v.status = req.status; vendaRepo.save(v); return ResponseEntity.ok(Map.of("mensagem", "Status atualizado!")); }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/venda/{id}") public ResponseEntity<?> alterarVenda(@PathVariable Long id, @RequestBody Venda dados) {
        return vendaRepo.findById(id).map(v -> {
            v.clienteNome = dados.clienteNome; v.formaPagamento = dados.formaPagamento; v.observacao = dados.observacao; v.status = dados.status;
            vendaRepo.save(v);
            return ResponseEntity.ok(Map.of("mensagem", "Venda alterada com sucesso!"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/venda/{id}") public ResponseEntity<?> deletar(@PathVariable Long id) { vendaRepo.deleteById(id); return ResponseEntity.ok(Map.of("mensagem", "Venda e itens deletados!")); }

    private ResponseEntity<?> salvarVenda(Venda venda, String mensagem) {
        if (venda.dataVenda == null) venda.dataVenda = java.time.LocalDateTime.now();
        if (venda.desconto == null) venda.desconto = BigDecimal.ZERO;
        if (venda.subtotal == null) venda.subtotal = BigDecimal.ZERO;
        if (venda.valorTotal == null) venda.valorTotal = venda.subtotal;
        List<VendaItem> itens = new ArrayList<>(venda.itens == null ? List.of() : venda.itens);
        venda.itens.clear();
        Venda salva = vendaRepo.save(venda);
        for (VendaItem item : itens) {
            Produto produto = produtoRepo.findById(item.produtoId).orElse(null);
        
            item.venda = salva;
            if (produto != null) {
                item.nome = produto.nome;
                int qtd = item.quantidade == null ? 0 : item.quantidade;
                produto.estoque = Math.max(0, (produto.estoque == null ? 0 : produto.estoque) - qtd);
                produtoRepo.save(produto);
            }
            salva.itens.add(item);
        }
        vendaRepo.save(salva);
        return ResponseEntity.ok(Map.of("idVenda", salva.id, "mensagem", mensagem));
    }
}
