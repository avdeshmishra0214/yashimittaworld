package com.kidsgames.config;

public class AuthenticatedUser {
    private final String username;
    private final Long userId;

    public AuthenticatedUser(String username, Long userId) {
        this.username = username;
        this.userId = userId;
    }

    public String getUsername() { return username; }
    public Long getUserId() { return userId; }
}
