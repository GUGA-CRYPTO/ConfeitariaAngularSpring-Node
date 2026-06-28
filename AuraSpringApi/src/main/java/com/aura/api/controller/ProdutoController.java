package com.aura.api.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.aura.api.model.Produto;
import com.aura.api.repository.ProdutoRepository;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/produto")
public class ProdutoController {
    private final ProdutoRepository repo;
    private final String uploadDir = "storage/";

    public ProdutoController(ProdutoRepository repo) {
        this.repo = repo;
        new File(uploadDir).mkdirs(); // 
    }
    
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.initDirectFieldAccess(); // Ensina o Spring a preencher os campos públicos sem exigir Getters/Setters
        binder.setDisallowedFields("imagem"); // Evita que o Spring tente converter o Arquivo em String automaticamente
    }

    @GetMapping
    public ResponseEntity<?> listar() { return ResponseEntity.ok(repo.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> porId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping // ModelAttribute absorve as propriedades do multipart/form-data do Angular
    public ResponseEntity<?> criar(@ModelAttribute Produto produto, HttpServletRequest req) {
        try {
            MultipartFile file = null;
            if (req instanceof MultipartHttpServletRequest mReq) file = mReq.getFile("imagem");
            
            if (file != null && !file.isEmpty()) {
                produto.imagem = salvarImagem(file);
            } else {
                String imgTexto = req.getParameter("imagem");
                if (imgTexto != null && !imgTexto.equals("null")) produto.imagem = imgTexto;
            }
            Produto salvo = repo.save(produto);
            return ResponseEntity.ok(Map.of("id", salvo.id, "mensagem", "Produto cadastrado!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao salvar: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @ModelAttribute Produto dados, HttpServletRequest req) {
        return repo.findById(id).map(p -> {
            try {
                p.nome = dados.nome; p.descricao = dados.descricao; p.categoria = dados.categoria;
                p.preco = dados.preco; p.estoque = dados.estoque; p.ingredientes = dados.ingredientes; p.status = dados.status;
                
                MultipartFile file = null;
                if (req instanceof MultipartHttpServletRequest mReq) file = mReq.getFile("imagem");
                
                if (file != null && !file.isEmpty()) {
                    p.imagem = salvarImagem(file); // Se mandou foto nova, atualiza
                } else {
                    String imgTexto = req.getParameter("imagem");
                    if (imgTexto != null && !imgTexto.equals("null")) p.imagem = imgTexto; // Mantém a antiga
                }
                repo.save(p);
                return ResponseEntity.ok(Map.of("mensagem", "Produto atualizado!"));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(400).body(Map.of("erro", "Erro ao atualizar: " + e.getMessage()));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) { repo.deleteById(id); return ResponseEntity.ok(Map.of("mensagem", "Produto deletado!")); }

    private String salvarImagem(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        try {
            String nomeOriginal = file.getOriginalFilename();
            if (nomeOriginal != null) {
                nomeOriginal = nomeOriginal.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                if (nomeOriginal.length() > 50) nomeOriginal = nomeOriginal.substring(nomeOriginal.length() - 50);
            } else {
                nomeOriginal = "foto.png";
            }
            String nomeArquivo = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0,8) + "_" + nomeOriginal;
            
            Path pastaDestino = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(pastaDestino); 
            Path caminhoFinal = pastaDestino.resolve(nomeArquivo);
            file.transferTo(caminhoFinal.toFile()); 
            return nomeArquivo;
        } catch (Exception e) { throw new RuntimeException("Falha no disco (" + e.getClass().getSimpleName() + "): " + e.getMessage()); }
    }
}