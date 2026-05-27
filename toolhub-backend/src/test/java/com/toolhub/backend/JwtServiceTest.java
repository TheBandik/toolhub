package com.toolhub.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.toolhub.backend.auth.JwtService;
import com.toolhub.backend.user.User;
import io.jsonwebtoken.Claims;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    JwtService jwtService;

    @Test
    void roundTrip() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");

        String token = jwtService.generateAccessToken(user);
        Claims claims = jwtService.parseAndValidate(token);

        assertEquals(user.getId().toString(), claims.getSubject());
        assertEquals("test@example.com", claims.get("email"));
        assertEquals("access", claims.get("type"));
    }

    @Test
    void refreshRoundTrip() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");

        String token = jwtService.generateRefreshToken(user);
        Claims claims = jwtService.parseAndValidate(token);

        assertEquals(user.getId().toString(), claims.getSubject());
        assertEquals("test@example.com", claims.get("email"));
        assertEquals("refresh", claims.get("type"));
    }
}
