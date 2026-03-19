// Synthesized sound effects using Web Audio API — no external files needed

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function playTone(frequency, duration, type = 'sine', gain = 0.3, delay = 0) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    osc.connect(gainNode);
    gainNode.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
    gainNode.gain.setValueAtTime(gain, ac.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration);
  } catch (e) {
    // Audio not supported — silently fail
  }
}

export const sounds = {
  correct() {
    playTone(523, 0.12, 'sine', 0.3, 0);    // C5
    playTone(659, 0.12, 'sine', 0.3, 0.1);  // E5
    playTone(784, 0.2,  'sine', 0.3, 0.2);  // G5
  },

  wrong() {
    playTone(300, 0.1, 'sawtooth', 0.2, 0);
    playTone(220, 0.2, 'sawtooth', 0.2, 0.1);
  },

  flip() {
    playTone(440, 0.06, 'sine', 0.15, 0);
  },

  match() {
    playTone(659, 0.1, 'sine', 0.25, 0);
    playTone(880, 0.15, 'sine', 0.25, 0.1);
  },

  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => playTone(freq, 0.2, 'sine', 0.3, i * 0.12));
    // Extra sparkle
    setTimeout(() => {
      playTone(1319, 0.1, 'sine', 0.2, 0);
      playTone(1568, 0.3, 'sine', 0.2, 0.1);
    }, 500);
  },

  tick() {
    playTone(800, 0.05, 'square', 0.1, 0);
  },
};
