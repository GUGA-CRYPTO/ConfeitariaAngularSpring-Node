package com.aura.api.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.aura.api.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    private final AuthService authService;
    public AuthInterceptor(AuthService authService) { this.authService = authService; }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
        String path = request.getRequestURI();
        boolean publico = path.equals("/login") || path.equals("/pedido") || path.startsWith("/storage/") || path.startsWith("/h2-console") || (path.equals("/produto") && request.getMethod().equals("GET")) || (path.startsWith("/produto/") && request.getMethod().equals("GET")) || path.startsWith("/error");
        if (publico) return true;

        String token = request.getHeader("x-access-token");
        if (!authService.tokenValido(token)) {
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write("{\"erro\":\"Token inválido ou ausente. Faça login novamente.\"}");
            return false;
        }
        request.setAttribute("usuario_id", authService.usuarioIdDoToken(token));
        return true;
    }
}
