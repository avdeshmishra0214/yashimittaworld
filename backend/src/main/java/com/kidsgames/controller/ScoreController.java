package com.kidsgames.controller;

import com.kidsgames.config.AuthenticatedUser;
import com.kidsgames.model.Profile;
import com.kidsgames.model.Score;
import com.kidsgames.service.ProfileService;
import com.kidsgames.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;
    private final ProfileService profileService;

    public ScoreController(ScoreService scoreService, ProfileService profileService) {
        this.scoreService = scoreService;
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<Score> saveScore(@Valid @RequestBody Score score,
                                           @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(scoreService.saveScore(score));
    }

    @GetMapping("/{profileId}")
    public List<Score> getScoresByProfile(@PathVariable Long profileId) {
        return scoreService.getScoresByProfileId(profileId);
    }

    @GetMapping("/leaderboard/{game}")
    public List<Map<String, Object>> getLeaderboard(@PathVariable String game) {
        List<Score> scores = scoreService.getLeaderboard(game);
        return scores.stream().map(s -> {
            Profile profile = profileService.getProfileById(s.getProfileId()).orElse(null);
            return Map.<String, Object>of(
                "id",           s.getId(),
                "profileId",    s.getProfileId(),
                "profileName",  profile != null ? profile.getName()   : "Player #" + s.getProfileId(),
                "avatar",       profile != null ? profile.getAvatar() : "👤",
                "game",         s.getGame(),
                "points",       s.getPoints(),
                "difficulty",   s.getDifficulty(),
                "playedAt",     s.getPlayedAt().toString()
            );
        }).collect(Collectors.toList());
    }
}
