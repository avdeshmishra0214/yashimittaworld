package com.kidsgames.controller;

import com.kidsgames.config.JwtUtil;
import com.kidsgames.model.User;
import com.kidsgames.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }
        User user = new User(req.getUsername(), passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", user.getUsername(),
            "userId", user.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        return userRepository.findByUsername(req.getUsername())
            .filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
            .map(u -> {
                String token = jwtUtil.generateToken(u.getUsername(), u.getId());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", u.getUsername(),
                    "userId", u.getId()
                ));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid username or password")));
    }

    public static class AuthRequest {
        @NotBlank @Size(min = 3, max = 30)
        private String username;
        @NotBlank @Size(min = 6, max = 100)
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
