package com.travelmemories.security;

// Minimal principal carried on the SecurityContext once a JWT is verified.
public record AuthenticatedUser(Long id, String email) {}
