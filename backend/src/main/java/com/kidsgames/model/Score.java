package com.kidsgames.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "score")
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long profileId;

    @NotBlank
    @Column(nullable = false)
    private String game;

    @NotNull
    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private LocalDateTime playedAt;

    @PrePersist
    public void prePersist() {
        playedAt = LocalDateTime.now();
    }

    public Score() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProfileId() { return profileId; }
    public void setProfileId(Long profileId) { this.profileId = profileId; }

    public String getGame() { return game; }
    public void setGame(String game) { this.game = game; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public LocalDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
}
