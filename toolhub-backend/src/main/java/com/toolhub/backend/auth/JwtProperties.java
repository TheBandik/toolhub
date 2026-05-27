package com.toolhub.backend.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "toolhub.jwt")
public record JwtProperties(
    String secret,
    long accessTtlMinutes,
    long refreshTtlDays
) {}
