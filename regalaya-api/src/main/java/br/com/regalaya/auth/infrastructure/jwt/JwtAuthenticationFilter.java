package br.com.regalaya.auth.infrastructure.jwt;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        String header = request.getHeader("Authorization");

        if (shouldSkipFilter(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                UUID userId = jwtUtil.validateAccessToken(token);
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getStatus() == null || !user.getStatus().equals("ACTIVE")) {
                    // Aqui mantemos o bloqueio pois o usuário foi encontrado mas está inativo
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"User account is not active\"}");
                    return;
                }

                UserDetails userDetails = UserDetailsImpl.build(user);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // Em vez de retornar 401, apenas limpamos o contexto e deixamos seguir.
                // Se a rota for protegida, o Spring Security bloqueará adiante.
                // Isso resolve o problema de rotas públicas bloqueadas por tokens expirados no browser.
                SecurityContextHolder.clearContext();
                logger.debug("Invalid or expired JWT token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldSkipFilter(String path) {
        // Removido o prefixo /api que não faz parte do servlet path se configurado como context-path
        return path.startsWith("/v1/auth/") || 
               path.startsWith("/v1/products/") || 
               path.startsWith("/v1/ai/") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs");
    }
}
