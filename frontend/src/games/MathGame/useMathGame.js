import { useState, useEffect, useCallback } from 'react';

function generateQuestion(difficulty) {
  const max = difficulty === 'hard' ? 99 : 9;
  const min = difficulty === 'hard' ? 10 : 1;
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * (max - min + 1)) + min;
  let b = Math.floor(Math.random() * (max - min + 1)) + min;

  if (op === '-' && b > a) [a, b] = [b, a];

  let answer;
  switch (op) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '×': answer = a * b; break;
    default: answer = a + b;
  }
  return { text: `${a} ${op} ${b} = ?`, answer };
}

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 15;

export function useMathGame(difficulty = 'easy') {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [phase, setPhase] = useState('idle'); // idle | playing | finished
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null

  const initGame = useCallback(() => {
    const qs = Array.from({ length: TOTAL_QUESTIONS }, () => generateQuestion(difficulty));
    setQuestions(qs);
    setCurrent(0);
    setInput('');
    setResults([]);
    setTimeLeft(TIME_PER_QUESTION);
    setPhase('playing');
    setFeedback(null);
  }, [difficulty]);

  const submitAnswer = useCallback((val) => {
    if (phase !== 'playing') return;
    const q = questions[current];
    const correct = parseInt(val, 10) === q.answer;
    const bonus = correct ? Math.floor(timeLeft * 2) : 0;
    const pts = correct ? 10 + bonus : 0;
    const newResults = [...results, { correct, pts, timeLeft, answer: q.answer, given: val }];
    setResults(newResults);
    setFeedback(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= TOTAL_QUESTIONS) {
        setPhase('finished');
      } else {
        setCurrent(c => c + 1);
        setInput('');
        setTimeLeft(TIME_PER_QUESTION);
      }
    }, 700);
  }, [phase, questions, current, results, timeLeft]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    if (timeLeft <= 0) {
      submitAnswer('');
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, feedback, submitAnswer]);

  const score = results.reduce((s, r) => s + r.pts, 0);
  const correct = results.filter(r => r.correct).length;

  return {
    questions, current, input, setInput, results, timeLeft,
    phase, feedback, initGame, submitAnswer, score, correct,
    totalQuestions: TOTAL_QUESTIONS,
  };
}
