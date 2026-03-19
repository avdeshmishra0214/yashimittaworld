import confetti from 'canvas-confetti';

export function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF6B6B', '#FFD93D'] });
  fire(0.2,  { spread: 60, colors: ['#4ECDC4', '#6C63FF'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#95E77E', '#FF6B6B'] });
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1,  { spread: 120, startVelocity: 45 });
}

export function fireStar() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    shapes: ['star'],
    colors: ['#FFD93D', '#FF6B6B', '#6C63FF', '#4ECDC4'],
  });
}
