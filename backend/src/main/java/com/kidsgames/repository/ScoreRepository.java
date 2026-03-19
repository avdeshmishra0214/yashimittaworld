package com.kidsgames.repository;

import com.kidsgames.model.Score;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    List<Score> findByProfileIdOrderByPlayedAtDesc(Long profileId);

    @Query("SELECT s FROM Score s WHERE s.game = :game ORDER BY s.points DESC")
    List<Score> findTopByGameOrderByPointsDesc(@Param("game") String game, Pageable pageable);
}
