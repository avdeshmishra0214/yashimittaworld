import { useState, useCallback } from 'react';

function scramble(word) {
  const arr = word.split('');
  let scrambled;
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    scrambled = arr.join('');
  } while (scrambled === word);
  return scrambled;
}

export function useWordGame() {
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | playing | finished
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const startGame = useCallback((wordList) => {
    const prepared = wordList.map(w => ({ ...w, scrambled: scramble(w.word) }));
    setWords(prepared);
    setCurrent(0);
    setInput('');
    setResults([]);
    setPhase('playing');
    setShowHint(false);
    setFeedback(null);
  }, []);

  const submitAnswer = useCallback(() => {
    if (phase !== 'playing') return;
    const w = words[current];
    const correct = input.trim().toLowerCase() === w.word.toLowerCase();
    const pts = correct ? (showHint ? 5 : 10) : 0;
    const newResults = [...results, { correct, pts, word: w.word, given: input }];
    setResults(newResults);
    setFeedback(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      setInput('');
      if (current + 1 >= words.length) {
        setPhase('finished');
      } else {
        setCurrent(c => c + 1);
      }
    }, 1000);
  }, [phase, words, current, input, results, showHint]);

  const skipWord = useCallback(() => {
    if (phase !== 'playing') return;
    const w = words[current];
    const newResults = [...results, { correct: false, pts: 0, word: w.word, given: '' }];
    setResults(newResults);
    setShowHint(false);
    setInput('');
    setFeedback(null);
    if (current + 1 >= words.length) {
      setPhase('finished');
    } else {
      setCurrent(c => c + 1);
    }
  }, [phase, words, current, results]);

  const score = results.reduce((s, r) => s + r.pts, 0);
  const correct = results.filter(r => r.correct).length;

  return {
    words, current, input, setInput, results, phase, showHint, setShowHint,
    feedback, startGame, submitAnswer, skipWord, score, correct,
  };
}
