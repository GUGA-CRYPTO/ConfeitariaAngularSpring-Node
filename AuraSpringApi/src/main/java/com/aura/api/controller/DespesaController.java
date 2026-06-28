package com.aura.api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aura.api.model.Despesa;
import com.aura.api.repository.DespesaRepository;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/despesa")
public class DespesaController {
    private final DespesaRepository repo;

    public DespesaController(DespesaRepository repo) { this.repo = repo; }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Despesa despesa, HttpServletRequest req) {
        Object uid = req.getAttribute("usuario_id");
        despesa.usuarioId = uid instanceof Long ? (Long) uid : null;
        Despesa salva = repo.save(despesa);
        return ResponseEntity.ok(Map.of("id", salva.id, "mensagem", "Despesa registrada!"));
    }

    @GetMapping
    public ResponseEntity<?> listar() { return ResponseEntity.ok(repo.findAllByOrderByDataDespesaDesc()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> porId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Despesa dados) {
        return repo.findById(id).map(d -> {
            d.descricao = dados.descricao; d.categoria = dados.categoria;
            d.valor = dados.valor; d.dataDespesa = dados.dataDespesa; d.status = dados.status;
            repo.save(d);
            return ResponseEntity.ok(Map.of("mensagem", "Despesa atualizada!"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Despesa deletada!"));
    }
}