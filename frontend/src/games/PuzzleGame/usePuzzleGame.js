import { useState, useEffect, useCallback } from 'react';

const EMOJIS = {
  easy: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'],
  hard: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐙'],
};

function getNeighbors(idx, size) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const n = [];
  if (row > 0)        n.push(idx - size);
  if (row < size - 1) n.push(idx + size);
  if (col > 0)        n.push(idx - 1);
  if (col < size - 1) n.push(idx + 1);
  return n;
}

// Shuffle by applying random valid moves from solved state — always solvable
function shufflePuzzle(solvedTiles, size, numMoves = 300) {
  let tiles = [...solvedTiles];
  let emptyIdx = tiles.findIndex(t => t === null);
  let lastMoved = -1;
  for (let i = 0; i < numMoves; i++) {
    const neighbors = getNeighbors(emptyIdx, size).filter(n => n !== lastMoved);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIdx], tiles[pick]] = [tiles[pick], tiles[emptyIdx]];
    lastMoved = emptyIdx;
    emptyIdx = pick;
  }
  return tiles;
}

function isSolved(tiles) {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (!tiles[i] || tiles[i].value !== i) return false;
  }
  return tiles[tiles.length - 1] === null;
}

export function usePuzzleGame(difficulty = 'easy') {
  const [tiles, setTiles]     = useState([]);
  const [solved, setSolved]   = useState(false);
  const [moves, setMoves]     = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const size = difficulty === 'hard' ? 4 : 3;

  const initGame = useCallback(() => {
    const emojis = EMOJIS[difficulty];
    const solvedTiles = [
      ...emojis.map((emoji, i) => ({ id: i, emoji, value: i })),
      null,
    ];
    setTiles(shufflePuzzle(solvedTiles, size));
    setSolved(false);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
  }, [difficulty, size]);

  useEffect(() => { initGame(); }, [initGame]);

  // Timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const moveTile = useCallback((idx) => {
    if (solved) return;
    setTiles(prev => {
      const emptyIdx = prev.findIndex(t => t === null);
      if (!getNeighbors(emptyIdx, size).includes(idx)) return prev;
      if (!running) setRunning(true);
      const next = [...prev];
      [next[emptyIdx], next[idx]] = [next[idx], next[emptyIdx]];
      setMoves(m => m + 1);
      if (isSolved(next)) {
        setRunning(false);
        setSolved(true);
      }
      return next;
    });
  }, [solved, size, running]);

  const score = solved ? Math.max(0, 2000 - moves * 5 - seconds * 3) : 0;

  return { tiles, size, moves, seconds, solved, moveTile, initGame, score };
}
