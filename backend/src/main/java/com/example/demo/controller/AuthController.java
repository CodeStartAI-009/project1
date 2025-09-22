 package com.example.demo.controller;

import com.example.demo.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class AuthController {

    // In-memory user store (replace with DB in production)
    private Map<String, User> userMap = new HashMap<>();

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userMap.containsKey(user.getUsername())) {
            return ResponseEntity.status(400).body("Username already exists");
        }
        userMap.put(user.getUsername(), user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginRequest) {
        User user = userMap.get(loginRequest.getUsername());
        if (user == null || !user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(403).body("Invalid credentials");
        }
        return ResponseEntity.ok("Login successful");
    }
}
