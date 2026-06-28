package com.aura.api.service;

import com.aura.api.model.Usuario;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Service
public class AuthService {
    public String md5(String valor) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(valor.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    public String gerarToken(Usuario u) {
        String raw = "aura:" + u.id + ":" + u.usuario + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    public boolean tokenValido(String token) {
        if (token == null || token.isBlank()) return false;
        try {
            String decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            return decoded.startsWith("aura:");
        } catch (Exception e) { return false; }
    }

    public Long usuarioIdDoToken(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            return Long.parseLong(decoded.split(":")[1]);
        } catch (Exception e) { return null; }
    }
}
