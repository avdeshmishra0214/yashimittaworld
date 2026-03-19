package com.kidsgames.service;

import com.kidsgames.model.Score;
import com.kidsgames.repository.ScoreRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public Score saveScore(Score score) {
        return scoreRepository.save(score);
    }

    public List<Score> getScoresByProfileId(Long profileId) {
        return scoreRepository.findByProfileIdOrderByPlayedAtDesc(profileId);
    }

    public List<Score> getLeaderboard(String game) {
        return scoreRepository.findTopByGameOrderByPointsDesc(game, PageRequest.of(0, 10));
    }
}
