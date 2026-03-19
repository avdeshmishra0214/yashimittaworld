package com.kidsgames.service;

import com.kidsgames.model.Word;
import com.kidsgames.repository.WordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WordService {

    private final WordRepository wordRepository;

    public WordService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public List<Word> getWords(String difficulty, int count) {
        if (difficulty != null && !difficulty.isBlank()) {
            return wordRepository.findRandomByDifficulty(difficulty.toUpperCase(), count);
        }
        return wordRepository.findRandom(count);
    }

    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }
}
