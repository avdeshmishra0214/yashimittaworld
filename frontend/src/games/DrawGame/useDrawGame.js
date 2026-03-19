import { useState, useEffect, useRef, useCallback } from 'react';

const PROMPTS = [
  // Animals
  'a cat', 'a dog', 'a fish', 'a bird', 'a rabbit',
  'an elephant', 'a lion', 'a frog', 'a butterfly', 'a turtle',
  'a penguin', 'a shark', 'a horse', 'a monkey', 'a snake',
  // Food
  'an apple', 'a pizza', 'a cake', 'a banana', 'a burger',
  'a cookie', 'a watermelon', 'ice cream', 'a taco', 'a donut',
  // Objects
  'a house', 'a car', 'a tree', 'a star', 'the sun',
  'the moon', 'a cloud', 'a rainbow', 'a flower', 'a key',
  'an umbrella', 'a hat', 'a book', 'a ball', 'a rocket',
  // Nature/Misc
  'a mountain', 'a boat', 'a train', 'a clock', 'a crown',
  'a guitar', 'a diamond', 'a heart', 'a ghost', 'a cactus',
];

const ROUNDS = 5;
const SECONDS_PER_ROUND = 60;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useDrawGame() {
  const [phase, setPhase] = useState('idle'); // idle | drawing | judging | finished
  const [difficulty, setDifficulty] = useState('EASY');
  const [prompts, setPrompts] = useState([]);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_ROUND);
  const [roundScores, setRoundScores] = useState([]);
  const [score, setScore] = useState(0);

  const timerRef = useRef(null);

  const currentPrompt = prompts[round] || '';
  const timeLimit = difficulty === 'EASY' ? 60 : difficulty === 'MEDIUM' ? 45 : 30;

  const startGame = useCallback((diff = difficulty) => {
    setDifficulty(diff);
    const selected = shuffle(PROMPTS).slice(0, ROUNDS);
    setPrompts(selected);
    setRound(0);
    setRoundScores([]);
    setScore(0);
    setTimeLeft(diff === 'EASY' ? 60 : diff === 'MEDIUM' ? 45 : 30);
    setPhase('drawing');
  }, [difficulty]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'drawing') return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('judging');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, round]);

  const timeUp = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase('judging');
  }, []);

  const judge = useCallback((gotIt) => {
    const pts = gotIt
      ? (difficulty === 'EASY' ? 100 : difficulty === 'MEDIUM' ? 150 : 200) + timeLeft * 2
      : 0;
    const newScores = [...roundScores, { prompt: currentPrompt, gotIt, pts, timeLeft }];
    setRoundScores(newScores);
    setScore(s => s + pts);

    const nextRound = round + 1;
    if (nextRound >= ROUNDS) {
      setPhase('finished');
    } else {
      setRound(nextRound);
      setTimeLeft(difficulty === 'EASY' ? 60 : difficulty === 'MEDIUM' ? 45 : 30);
      setPhase('drawing');
    }
  }, [roundScores, currentPrompt, round, timeLeft, difficulty]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase('idle');
    setRound(0);
    setRoundScores([]);
    setScore(0);
  }, []);

  return {
    phase, difficulty, setDifficulty,
    round, currentPrompt, timeLeft, timeLimit,
    roundScores, score,
    startGame, timeUp, judge, reset,
    totalRounds: ROUNDS,
  };
}
