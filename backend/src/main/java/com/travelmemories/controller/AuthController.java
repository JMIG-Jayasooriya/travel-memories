package com.travelmemories.controller;

import com.travelmemories.dto.AuthDtos.*;
import com.travelmemories.model.User;
import com.travelmemories.repository.UserRepository;
import com.travelmemories.security.AuthenticatedUser;
import com.travelmemories.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "An account with this email already exists."));
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                )
        );
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.email()).orElse(null);

        if (user == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid email or password."));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                )
        );
    }

    // =========================
    // GET CURRENT USER
    // =========================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal AuthenticatedUser me) {
        if (me == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findById(me.id()).orElse(null);
        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "User not found."));
        }

        return ResponseEntity.ok(
                new AuthResponse(
                        null,
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                )
        );
    }
}