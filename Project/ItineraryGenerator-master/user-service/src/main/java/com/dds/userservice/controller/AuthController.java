package com.dds.userservice.controller;

import com.dds.userservice.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import com.dds.userservice.model.User;
import com.dds.userservice.repository.UserRepository;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "error", "Username and password must be provided"
                ));
            }

            // Call authService to register user and generate token
            String token = authService.register(username, password);

            // Fetch the newly created user’s ID
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "failed",
                    "error", "User not found after registration"
                ));
            }

            String userId = String.valueOf(userOptional.get().getId());

            // Return success response
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "success",
                "token", token,
                "userId", userId
            ));

        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", "failed",
                "error", e.getMessage()
            ));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "error", "Username and password must be provided"
                ));
            }

            // Authenticate user and get token
            String token = authService.login(username, password);

            // Fetch user ID from repository
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "failed",
                    "error", "User not found"
                ));
            }

            String userId = String.valueOf(userOptional.get().getId());

            // Success response
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "token", token,
                "userId", userId
            ));

        } catch (AuthenticationException e) {
            // Specific case for failed login
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", "failed",
                "error", "Invalid username or password"
            ));
        } catch (Exception e) {
            // General fallback for unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", "failed",
                "error", e.getMessage()
            ));
        }
    }



    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // Expect header: "Authorization: Bearer <token>"
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            boolean isValid = authService.validateToken(token);

            if (!isValid) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            return ResponseEntity.ok("valid");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Token validation failed: " + e.getMessage());
        }
    }
}
