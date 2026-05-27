package com.toolhub.backend.auth;

import com.toolhub.backend.auth.dto.LoginRequest;
import com.toolhub.backend.auth.dto.RefreshRequest;
import com.toolhub.backend.auth.dto.RegisterRequest;
import com.toolhub.backend.auth.dto.TokenResponse;
import com.toolhub.backend.user.User;
import com.toolhub.backend.user.UserRepository;
import io.jsonwebtoken.Claims;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        String email = request.email();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email already in use"
            );
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User();
        user.setEmail(email);
        user.setName(request.name());
        user.setPasswordHash(passwordHash);

        var saved = userRepository.save(user);

        return new TokenResponse(
            jwtService.generateAccessToken(saved),
            jwtService.generateRefreshToken(saved)
        );
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository
            .findByEmail(request.email())
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
                )
            );

        if (
            !passwordEncoder.matches(request.password(), user.getPasswordHash())
        ) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid credentials"
            );
        }

        return new TokenResponse(
            jwtService.generateAccessToken(user),
            jwtService.generateRefreshToken(user)
        );
    }

    public TokenResponse refresh(RefreshRequest request) {
        String refreshToken = request.refreshToken();
        Claims claims = jwtService.parseAndValidate(refreshToken);

        if (!"refresh".equals(claims.get("type", String.class))) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid token type"
            );
        }

        UUID userId = UUID.fromString(claims.getSubject());

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
                )
            );

        return new TokenResponse(
            jwtService.generateAccessToken(user),
            refreshToken
        );
    }
}
