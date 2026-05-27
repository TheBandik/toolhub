package com.toolhub.backend.auth;

import com.toolhub.backend.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    private void tryAuthenticate(String token) {
        try {
            Claims claims = jwtService.parseAndValidate(token);

            if (!"access".equals(claims.get("type", String.class))) return;

            UUID userId = UUID.fromString(claims.getSubject());
            userRepository.findById(userId).ifPresent(user -> {
                var authToken = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    List.of()
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            });
        } catch (JwtException e) {
            logger.debug("Invalid token");
        }
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            tryAuthenticate(header.substring(7));
        }

        filterChain.doFilter(request, response);
    }
}
