import { useState, useEffect, useCallback } from 'react';

const CARD_SETS = {
  easy: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'],
  hard: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐙','🦋','🐬','🦕'],
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useMemoryGame(difficulty = 'easy') {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  const initGame = useCallback(() => {
    const emojis = difficulty === 'hard' ? CARD_SETS.hard : CARD_SETS.easy;
    const paired = shuffle([...emojis, ...emojis]).map((emoji, i) => ({ id: i, emoji, key: emoji }));
    setCards(paired);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setFinished(false);
    setLocked(false);
  }, [difficulty]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setRunning(false);
      setFinished(true);
    }
  }, [matched, cards]);

  const flipCard = useCallback((id) => {
    if (locked || flipped.includes(id) || matched.includes(id)) return;
    if (!running) setRunning(true);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid));
      if (a.key === b.key) {
        setMatched(m => [...m, a.id, b.id]);
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [locked, flipped, matched, cards, running]);

  const score = finished
    ? Math.max(0, 1000 - moves * 10 - seconds * 2)
    : 0;

  return { cards, flipped, matched, moves, seconds, finished, flipCard, initGame, score };
}
