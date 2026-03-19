package com.kidsgames.controller;

import com.kidsgames.model.Score;
import com.kidsgames.service.ScoreService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "http://localhost:5173")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public ResponseEntity<Score> saveScore(@Valid @RequestBody Score score) {
        return ResponseEntity.ok(scoreService.saveScore(score));
    }

    @GetMapping("/{profileId}")
    public List<Score> getScoresByProfile(@PathVariable Long profileId) {
        return scoreService.getScoresByProfileId(profileId);
    }

    @GetMapping("/leaderboard/{game}")
    public List<Score> getLeaderboard(@PathVariable String game) {
        return scoreService.getLeaderboard(game);
    }
}
