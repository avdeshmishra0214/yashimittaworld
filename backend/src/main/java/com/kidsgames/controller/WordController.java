package com.kidsgames.controller;

import com.kidsgames.model.Word;
import com.kidsgames.service.WordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "http://localhost:5173")
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public List<Word> getWords(
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "5") int count) {
        return wordService.getWords(difficulty, count);
    }
}
