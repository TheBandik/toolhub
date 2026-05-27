package com.toolhub.backend.auth.dto;

public record TokenResponse(String accessToken, String refreshToken) {}
